package com.sorychan.interviewengine.controller

import com.sorychan.interviewengine.data.CV
import com.sorychan.interviewengine.data.Job
import com.sorychan.interviewengine.dto.InterviewFeedbackDTO
import com.sorychan.interviewengine.dto.InterviewMessageDTO
import com.sorychan.interviewengine.dto.InterviewSummaryDTO
import com.sorychan.interviewengine.enums.InterviewStatus
import com.sorychan.interviewengine.security.UserPrincipal
import com.sorychan.interviewengine.service.ContextService
import com.sorychan.interviewengine.service.InterviewService
import com.sorychan.interviewengine.service.S3StorageService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/interview/v1")
class InterviewController(
    private val contextService: ContextService,
    private val storageService: S3StorageService,
    private val interviewService: InterviewService
) {
    private val logger: Logger = LoggerFactory.getLogger(this::class.java)

    private fun getCurrentUser(): UserPrincipal {
        val auth = SecurityContextHolder.getContext().authentication
        return auth.principal as UserPrincipal
    }

    @GetMapping("/interviews/{interviewId}/messages")
    fun getInterviewMessages(@PathVariable interviewId: Long): ResponseEntity<Any> {
        logger.info("GET /interviews/$interviewId/messages called")
        val interview = interviewService.getInterview(interviewId) ?: return ResponseEntity.notFound().build()

        if (interview.userId != getCurrentUser().id) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have access to this interview.")
        }

        val messages = interviewService.getMessagesByInterviewId(interviewId)
        val dtos = messages.map { msg ->
            InterviewMessageDTO(
                id = msg.id,
                content = msg.content,
                role = msg.role,
                createdAt = msg.createdAt
            )
        }
        return ResponseEntity.ok(dtos)
    }


    @GetMapping("/interviews/{interviewId}/feedback")
    fun getInterviewFeedback(@PathVariable interviewId: Long): ResponseEntity<Any> {
        logger.info("GET /interviews/$interviewId/feedback called")
        val interview = interviewService.getInterview(interviewId) ?: return ResponseEntity.notFound().build()

        if (interview.userId != getCurrentUser().id) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have access to this feedback.")
        }

        if (interview.status != InterviewStatus.COMPLETED || interview.overallGrade == null) {
            return ResponseEntity.noContent().build()
        }

        val feedback = InterviewFeedbackDTO(
            technicalScore = interview.technicalScore ?: 0.0,
            communicationScore = interview.communicationScore ?: 0.0,
            overallGrade = interview.overallGrade ?: 0.0,
            strengths = interview.strengths?.split(";") ?: emptyList(),
            weaknesses = interview.weaknesses?.split(";") ?: emptyList(),
            improvementTips = interview.improvementTips?.split(";") ?: emptyList(),
            summary = interview.summary ?: ""
        )

        return ResponseEntity.ok(feedback)
    }

    @GetMapping("/interviews/{interviewId}")
    fun getInterview(@PathVariable interviewId: Long): ResponseEntity<Any> {
        logger.info("GET /interviews/$interviewId called")
        val interview = interviewService.getInterview(interviewId) ?: return ResponseEntity.notFound().build()

        if (interview.userId != getCurrentUser().id) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have access to this interview.")
        }

        val dto = InterviewSummaryDTO(
            id = interview.id!!,
            userId = interview.userId!!,
            name = interview.name,
            status = interview.status,
            createdAt = interview.createdAt
        )
        return ResponseEntity.ok(dto)
    }

    @GetMapping("/interviews/user/{userId}")
    fun getInterviewsByUser(@PathVariable userId: Long): ResponseEntity<Any> {
        logger.info("GET /interviews/user/$userId called")

        if (userId != getCurrentUser().id) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have access to these interviews.")
        }

        val interviews = interviewService.getInterviewsByUserId(userId)
        val dtos = interviews.map { interview ->
            InterviewSummaryDTO(
                id = interview.id!!,
                userId = interview.userId!!,
                name = interview.name,
                status = interview.status,
                createdAt = interview.createdAt
            )
        }
        return ResponseEntity.ok(dtos)
    }

    /**
     * Upload a CV (PDF), extract its text, clean it and analyze it.
     */
    @PostMapping("/upload-cv", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun uploadCV(
        @RequestParam("file") file: MultipartFile,
        @RequestParam("userId") userId: Long
    ): ResponseEntity<String> {

        if (userId != getCurrentUser().id) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.")
        }

        if (file.isEmpty || file.contentType != "application/pdf") {
            return ResponseEntity.badRequest().body("Invalid PDF File.")
        }

        if (!contextService.isRealPdf(file)) {
            logger.warn("Potential malicious PDF file in upload.")
            return ResponseEntity.badRequest().body("Incorrect File Content Detected.")
        }

        val resource = file.resource
        val extractedText = contextService.extractTextFromPdf(resource)
        val summary = contextService.analyzeCV(extractedText)

        try {
            storageService.uploadFile(file)
        } catch (e: Exception) {
            logger.error("S3 Upload Failed", e)
            return ResponseEntity.internalServerError().body("Failed to upload CV to S3: ${e.message}")
        }

        try {
            val newCV = CV(
                fileName = resource.filename!!,
                userId = userId,
                content = summary
            )
            contextService.addCV(newCV)
            return ResponseEntity.ok(summary)
        } catch (e: NullPointerException) {
            logger.error("Null PDF filename! Error message: ${e.toString()}")
            return ResponseEntity.badRequest().body("Null PDF file name!")
        }
    }

    @PostMapping("/upload-job")
    fun uploadDescription(
        @RequestParam jobName: String,
        @RequestParam description: String,
        @RequestParam userId: Long
    ): ResponseEntity<String> {

        if (userId != getCurrentUser().id) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.")
        }

        val job = Job(
            jobName = jobName,
            description = description,
            userId = userId
        )
        try {
            val savedJob = contextService.addJobDescription(job)
            return ResponseEntity.ok(savedJob.id.toString())
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body(e.message)
        }
    }
}
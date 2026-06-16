package com.sorychan.usercontextualizer.config

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class GlobalExceptionHandler {

    private val logger = LoggerFactory.getLogger(this::class.java)

    @ExceptionHandler(Exception::class)
    fun handleGeneralException(ex: Exception): ResponseEntity<Map<String, String>> {
        val message = ex.message ?: "An unexpected error occurred"

        if (message.contains("429") || message.contains("quota", ignoreCase = true) || message.contains("limit", ignoreCase = true)) {
            logger.warn("AI Quota Exceeded detected: $message")
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(mapOf(
                "error" to "AI Quota Exceeded. Please wait a minute before trying again."
            ))
        }

        logger.error("Internal Server Error: ", ex)
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(mapOf(
            "error" to "Server Error: ${ex.message}"
        ))
    }
}

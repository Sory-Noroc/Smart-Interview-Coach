package com.sorychan.usercontextualizer.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin
@RequestMapping("llm/v1/demo")
class DemoController {

    private val demoQuestions = listOf(
        "Hello! Thank you for joining this demo. To start, could you tell me a bit about yourself and your background?",
        "That sounds interesting. Can you tell me about your experience at your last job? What were your main responsibilities?",
        "How do you usually approach working in a team? What role do you typically take?",
        "What would you say is your greatest professional achievement so far?",
        "Where do you see yourself professionally in the next three to five years?",
        "Thank you for participating in this demo! In a full interview, you would now receive detailed AI-generated feedback based on your answers."
    )

    @PostMapping("/start")
    fun startDemo(): ResponseEntity<Map<String, String>> {
        return ResponseEntity.ok(mapOf(
            "question" to demoQuestions[0],
            "step" to "0"
        ))
    }

    @PostMapping("/answer")
    fun answerDemo(@RequestBody request: DemoAnswerRequest): ResponseEntity<Map<String, String>> {
        val nextStep = (request.step.toIntOrNull() ?: 0) + 1
        
        val response = if (nextStep < demoQuestions.size) {
            demoQuestions[nextStep]
        } else {
            "The demo has finished! Thank you!"
        }

        return ResponseEntity.ok(mapOf(
            "response" to response,
            "step" to nextStep.toString()
        ))
    }
}

data class DemoAnswerRequest(
    val answer: String,
    val step: String
)

package com.sorychan.uac.config

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationExceptions(ex: MethodArgumentNotValidException): ResponseEntity<Map<String, String?>> {
        val errorMessage = ex.bindingResult.fieldErrors.joinToString("; ") { error ->
            "${error.defaultMessage}"
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mapOf("error" to errorMessage))
    }

    @ExceptionHandler(RuntimeException::class)
    fun handleRuntimeException(ex: RuntimeException): ResponseEntity<Map<String, String?>> {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mapOf("error" to ex.message))
    }
}

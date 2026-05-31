package com.sorychan.uac.controller

import com.sorychan.uac.dto.ForgotPasswordRequest
import com.sorychan.uac.dto.ResetPasswordRequest
import com.sorychan.uac.service.UserService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin
@RequestMapping("/uac/v1/auth")
class PasswordResetController(
    private val userService: UserService
) {

    @PostMapping("/forgot-password")
    fun forgotPassword(@Valid @RequestBody request: ForgotPasswordRequest): ResponseEntity<Map<String, String>> {
        userService.createResetToken(request.email)
        return ResponseEntity.ok(mapOf("message" to "Request processed."))
    }

    @PostMapping("/reset-password")
    fun resetPassword(@Valid @RequestBody request: ResetPasswordRequest): ResponseEntity<Map<String, String>> {
        userService.resetPassword(request.token, request.newPassword)
        return ResponseEntity.ok(mapOf("message" to "Password has been reset successfully."))
    }
}

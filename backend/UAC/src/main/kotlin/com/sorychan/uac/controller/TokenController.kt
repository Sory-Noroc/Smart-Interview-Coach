package com.sorychan.uac.controller

import com.sorychan.uac.dto.AuthResponse
import com.sorychan.uac.dto.LoginRequest
import com.sorychan.uac.dto.RegisterRequest
import com.sorychan.uac.model.User
import com.sorychan.uac.service.JwtService
import com.sorychan.uac.service.UserService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/uac/v1/auth")
class TokenController(
    private val userService: UserService,
    private val jwtService: JwtService
) {

    @PostMapping("/register")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<Any> {
        val user = User(
            username = request.username,
            email = request.email,
            firstName = request.firstName,
            lastName = request.lastName,
            passwordHash = request.password
        )
        val savedUser = userService.registerUser(user)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser)
    }

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<Any> {
        val user = userService.authenticate(request.username, request.password)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(mapOf("error" to "Invalid credentials"))

        val token = jwtService.generateToken(user.username, mapOf("role" to user.role.name))
        return ResponseEntity.ok(AuthResponse(token, user.username, user.role.name))
    }
}
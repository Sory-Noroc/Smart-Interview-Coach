package com.sorychan.uac.controller

import com.sorychan.uac.dto.*
import com.sorychan.uac.model.User
import com.sorychan.uac.service.JwtService
import com.sorychan.uac.service.RefreshTokenService
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
    private val jwtService: JwtService,
    private val refreshTokenService: RefreshTokenService
) {

    @PostMapping("/register")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<User> {
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

        val accessToken = jwtService.generateToken(user.username, mapOf("role" to user.role.name))
        val refreshToken = refreshTokenService.createRefreshToken(user.id!!)
        
        return ResponseEntity.ok(AuthResponse(accessToken, refreshToken.token, user.username, user.role.name))
    }

    @PostMapping("/refresh")
    fun refreshToken(@Valid @RequestBody request: TokenRefreshRequest): ResponseEntity<TokenRefreshResponse> {
        return refreshTokenService.findByToken(request.refreshToken)
            .map { refreshTokenService.verifyExpiration(it) }
            .map { it.user }
            .map { user ->
                val accessToken = jwtService.generateToken(user.username, mapOf("role" to user.role.name))
                ResponseEntity.ok(TokenRefreshResponse(accessToken, request.refreshToken))
            }
            .orElseThrow { RuntimeException("Refresh token is not in database!") }
    }
}
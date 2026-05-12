package com.sorychan.uac.dto

data class LoginRequest(
    val username: String,
    val password: String
)

data class RegisterRequest(
    val username: String,
    val email: String,
    val firstName: String,
    val lastName: String,
    val password: String
)

data class AuthResponse(
    val token: String,
    val username: String,
    val role: String
)

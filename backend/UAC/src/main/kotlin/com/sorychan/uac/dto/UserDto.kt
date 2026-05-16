package com.sorychan.uac.dto

import jakarta.validation.constraints.NotBlank

data class UserProfileResponse(
    val id: Long?,
    val username: String,
    val email: String,
    val firstName: String,
    val lastName: String,
    val role: String
)

data class UpdateProfileRequest(
    @field:NotBlank(message = "First name is required")
    val firstName: String,

    @field:NotBlank(message = "Last name is required")
    val lastName: String
)

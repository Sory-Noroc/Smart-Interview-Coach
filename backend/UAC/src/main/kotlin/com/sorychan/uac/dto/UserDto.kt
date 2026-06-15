package com.sorychan.uac.dto

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class UserProfileResponse(
    val id: Long?,
    val username: String,
    val email: String,
    val firstName: String,
    val lastName: String,
    val role: String,
    @get:JsonProperty("isEnabled")
    val isEnabled: Boolean
)

data class UpdateProfileRequest(
    @field:NotBlank(message = "First name is required")
    val firstName: String,

    @field:NotBlank(message = "Last name is required")
    val lastName: String
)

data class ChangePasswordRequest(
    @field:NotBlank(message = "Old password is required")
    val oldPassword: String,

    @field:NotBlank(message = "New password is required")
    @field:Size(min = 10, message = "New password must be at least 10 characters long")
    val newPassword: String
)


package com.sorychan.uac.controller

import com.sorychan.uac.dto.UpdateProfileRequest
import com.sorychan.uac.dto.UserProfileResponse
import com.sorychan.uac.service.UserService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/uac/v1/users")
class UserController(
    private val userService: UserService
) {

    @GetMapping("/me")
    fun getCurrentUser(): ResponseEntity<UserProfileResponse> {
        val username = SecurityContextHolder.getContext().authentication?.name
        val user = userService.findByUsername(username ?: "")
            ?: throw RuntimeException("User not found")

        return ResponseEntity.ok(
            UserProfileResponse(
                id = user.id,
                username = user.username,
                email = user.email,
                firstName = user.firstName,
                lastName = user.lastName,
                role = user.role.name
            )
        )
    }

    @PutMapping("/me")
    fun updateProfile(@Valid @RequestBody request: UpdateProfileRequest): ResponseEntity<UserProfileResponse> {
        val username = SecurityContextHolder.getContext().authentication?.name ?: throw RuntimeException("User not found")
        val updatedUser = userService.updateProfile(username, request.firstName, request.lastName)

        return ResponseEntity.ok(
            UserProfileResponse(
                id = updatedUser.id,
                username = updatedUser.username,
                email = updatedUser.email,
                firstName = updatedUser.firstName,
                lastName = updatedUser.lastName,
                role = updatedUser.role.name
            )
        )
    }
}

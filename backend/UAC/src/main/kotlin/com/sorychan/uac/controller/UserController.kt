package com.sorychan.uac.controller

import com.sorychan.uac.dto.ChangePasswordRequest
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
        try {
            val username = SecurityContextHolder.getContext().authentication!!.name
            val user = userService.findByUsername(username)
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
        } catch (e: NullPointerException) {
            throw RuntimeException("Invalid token or format")
        }
    }

    @PutMapping("/me")
    fun updateProfile(@Valid @RequestBody request: UpdateProfileRequest): ResponseEntity<UserProfileResponse> {
        try {
            val username = SecurityContextHolder.getContext().authentication!!.name
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
        } catch (e: NullPointerException) {
            throw RuntimeException("Invalid token or format")
        }
    }

    @PutMapping("/me/password")
    fun changePassword(@Valid @RequestBody request: ChangePasswordRequest): ResponseEntity<Map<String, String>> {
        try {
            val username = SecurityContextHolder.getContext().authentication!!.name
            userService.changePassword(username, request.oldPassword, request.newPassword)
        } catch (e: NullPointerException) {
            throw RuntimeException("Invalid token or format")
        }
        return ResponseEntity.ok(mapOf("message" to "Password changed successfully"))
    }
}

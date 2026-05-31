package com.sorychan.uac.controller

import com.sorychan.uac.dto.UserProfileResponse
import com.sorychan.uac.enum.Role
import com.sorychan.uac.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin
@RequestMapping("/uac/v1/admin")
class AdminController(
    private val userService: UserService
) {

    @GetMapping("/users")
    fun getAllUsers(): ResponseEntity<List<UserProfileResponse>> {
        val users = userService.findAllUsers().map { user ->
            UserProfileResponse(
                id = user.id,
                username = user.username,
                email = user.email,
                firstName = user.firstName,
                lastName = user.lastName,
                role = user.role.name
            )
        }
        return ResponseEntity.ok(users)
    }

    @PutMapping("/users/{id}/status")
    fun toggleUserStatus(
        @PathVariable id: Long,
        @RequestParam enabled: Boolean
    ): ResponseEntity<Map<String, String>> {
        userService.toggleUserStatus(id, enabled)
        val status = if (enabled) "enabled" else "disabled"
        return ResponseEntity.ok(mapOf("message" to "User account has been $status"))
    }

    @PutMapping("/users/{id}/role")
    fun updateUserRole(
        @PathVariable id: Long,
        @RequestParam role: Role
    ): ResponseEntity<Map<String, String>> {
        userService.updateUserRole(id, role)
        return ResponseEntity.ok(mapOf("message" to "User role updated to ${role.name}"))
    }
}

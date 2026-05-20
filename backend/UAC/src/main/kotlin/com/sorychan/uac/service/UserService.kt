package com.sorychan.uac.service

import com.sorychan.uac.model.User
import com.sorychan.uac.repository.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val emailService: EmailService
) : UserDetailsService {
    private val logger = LoggerFactory.getLogger(UserService::class.java)

    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByUsername(username)
            .orElseThrow { UsernameNotFoundException("User not found: $username") }
        
        return org.springframework.security.core.userdetails.User
            .withUsername(user.username)
            .password(user.passwordHash)
            .authorities(user.role.name)
            .accountExpired(false)
            .accountLocked(false)
            .credentialsExpired(false)
            .disabled(!user.isEnabled)
            .build()
    }

    fun registerUser(user: User): User {
        if (userRepository.existsByUsername(user.username)) {
            throw RuntimeException("Username already exists")
        }
        if (userRepository.existsByEmail(user.email)) {
            throw RuntimeException("Email already exists")
        }

        try {
            user.passwordHash = passwordEncoder.encode(user.passwordHash)!!
        } catch (ex: NullPointerException) {
            throw RuntimeException("Password hash exception")
        }
        return userRepository.save(user)
    }

    fun authenticate(username: String, passwordRaw: String): User? {
        val user = userRepository.findByUsername(username).orElse(null)
        if (user != null && user.isEnabled && passwordEncoder.matches(passwordRaw, user.passwordHash)) {
            return user
        }
        return null
    }

    fun findByUsername(username: String): User? {
        return userRepository.findByUsername(username).orElse(null)
    }

    fun updateProfile(username: String, firstName: String, lastName: String): User {
        val user = userRepository.findByUsername(username)
            .orElseThrow { RuntimeException("User not found") }

        user.firstName = firstName
        user.lastName = lastName

        return userRepository.save(user)
    }

    fun changePassword(username: String, oldPasswordRaw: String, newPasswordRaw: String) {
        val user = userRepository.findByUsername(username)
            .orElseThrow { RuntimeException("User not found") }

        if (!passwordEncoder.matches(oldPasswordRaw, user.passwordHash)) {
            throw RuntimeException("Invalid current password")
        }

        try {
            user.passwordHash = passwordEncoder.encode(newPasswordRaw)!!
            userRepository.save(user)
        } catch (ex: NullPointerException) {
            throw RuntimeException("Password hash exception")
        }
    }

    fun createResetToken(email: String): String {
        val userObject = userRepository.findByEmail(email)
        if (userObject.isEmpty) {
            return ""
        }

        val user = userObject.get()
        val token = UUID.randomUUID().toString().take(6)
        user.resetToken = token
        user.resetTokenExpiry = LocalDateTime.now().plusHours(1)
        userRepository.save(user)

        emailService.sendPasswordResetEmail(user.email, token)

        return token
    }

    fun resetPassword(token: String, newPasswordRaw: String) {
        val user = userRepository.findByResetToken(token)
            .orElseThrow { RuntimeException("Invalid or expired token") }

        if (user.resetTokenExpiry?.isBefore(LocalDateTime.now()) == true) {
            throw RuntimeException("Token has expired")
        }

        user.passwordHash = passwordEncoder.encode(newPasswordRaw)!!
        user.resetToken = null
        user.resetTokenExpiry = null
        userRepository.save(user)
    }

    fun findAllUsers(): List<User> {
        return userRepository.findAll()
    }

    fun toggleUserStatus(id: Long, enabled: Boolean): User {
        val user = userRepository.findById(id)
            .orElseThrow { RuntimeException("User not found") }
        user.isEnabled = enabled
        return userRepository.save(user)
    }

    fun updateUserRole(id: Long, newRole: com.sorychan.uac.enum.Role): User {
        val user = userRepository.findById(id)
            .orElseThrow { RuntimeException("User not found") }
        user.role = newRole
        return userRepository.save(user)
    }
}

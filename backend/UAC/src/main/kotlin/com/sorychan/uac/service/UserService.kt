package com.sorychan.uac.service

import com.sorychan.uac.model.User
import com.sorychan.uac.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {
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
        if (passwordEncoder.matches(passwordRaw, user.passwordHash)) {
            return user
        }
        return null
    }
}

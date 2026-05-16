package com.sorychan.uac.service

import com.sorychan.uac.model.User
import com.sorychan.uac.repository.UserRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) : UserDetailsService {

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
        userRepository.findByUsername(username).orElse(null)?.also { user ->
            if (passwordEncoder.matches(passwordRaw, user.passwordHash)) {
                return user
            }
        }
        return null
    }
}

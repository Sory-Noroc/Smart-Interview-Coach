package com.sorychan.uac.config

import com.sorychan.uac.enum.Role
import com.sorychan.uac.model.User
import com.sorychan.uac.repository.UserRepository
import com.sorychan.uac.service.UserService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class DatabaseSeeder (
        private val userService: UserService,
        private val userRepository: UserRepository
    ) : CommandLineRunner {

    private val logger = LoggerFactory.getLogger(DatabaseSeeder::class.java)

        @Value("\${app.admin.username:admin}")
        private lateinit var adminUsername: String

        @Value("\${app.admin.password:admin12345}")
        private lateinit var adminPassword: String

        override fun run(vararg args: String?) {
            try {
                if (!userRepository.existsByUsername(adminUsername)) {
                    val user = User(
                        username = adminUsername,
                        email = "pytechie02@gmail.com",
                        firstName = "admin",
                        lastName = "admin",
                        passwordHash = adminPassword,
                        role = Role.ADMIN
                    )
                    val registeredUser = userService.registerUser(user, false)
                    registeredUser.isVerified = true
                    registeredUser.isEnabled = true
                    userRepository.save(registeredUser)
                    logger.info("Admin created.")
                } else {
                    logger.info("Admin present.")
                }
            } catch (ex: Exception) {
                logger.error("Admin Creation Error: ${ex.message}")
            }
        }
}
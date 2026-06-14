package com.sorychan.uac.repository

import com.sorychan.uac.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRepository : JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.username = :loginInput OR u.email = :loginInput")
    fun findByUsernameOrEmail(loginInput: String): Optional<User>

    fun findByEmail(email: String): Optional<User>
    fun findByResetToken(token: String): Optional<User>
    fun findByVerificationToken(token: String): Optional<User>
    fun existsByUsername(username: String): Boolean
    fun existsByEmail(email: String): Boolean
}

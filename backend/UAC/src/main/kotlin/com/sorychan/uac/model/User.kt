package com.sorychan.uac.model

import com.sorychan.uac.enum.Role
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

@Entity
@Table(name = "users")
class User (
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(unique = true, nullable = false)
    var username: String,

    @Column(unique = true, nullable = false)
    var email: String,

    var firstName: String,
    var lastName: String,

    @Column(nullable = false)
    var passwordHash: String,

    @Enumerated(EnumType.STRING)
    var role: Role = Role.USER,

    var isEnabled: Boolean = true,
    var createdAt: LocalDateTime = LocalDateTime.now(),

    var resetToken: String? = null,
    var resetTokenExpiry: LocalDateTime? = null
)
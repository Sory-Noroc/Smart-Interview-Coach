package com.sorychan.usercontextualizer.data

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
@Table(name = "interviews")
class Interview(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(name = "user_id", nullable = false)
    var userId: Long,

    @Column(name = "name", nullable = false)
    var name: String,

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    var status: InterviewStatus = InterviewStatus.STARTED,

    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now()
)

enum class InterviewStatus {
    STARTED, IN_PROGRESS, COMPLETED, CANCELLED
}
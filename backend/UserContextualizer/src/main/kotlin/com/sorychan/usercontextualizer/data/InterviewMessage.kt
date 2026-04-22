package com.sorychan.usercontextualizer.data

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.LocalDateTime

@Entity
@Table(name = "interview_messages")
class InterviewMessage(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    var interview: Interview,

    @Column(columnDefinition = "TEXT", nullable = false)
    var content: String,

    // "user" sau "assistant"
    @Column(name = "role", nullable = false)
    var role: String,

    var createdAt: LocalDateTime = LocalDateTime.now()
)

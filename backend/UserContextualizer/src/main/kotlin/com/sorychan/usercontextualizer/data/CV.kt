package com.sorychan.usercontextualizer.data

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name="cv_info")
class CV(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(name = "file_name", nullable = false)
    var fileName: String = "",

    @Column(name = "user_id", nullable = false)
    var userId: Long = 0L,

    @Column(columnDefinition = "TEXT", name = "content", nullable = false)
    var content: String = "",

    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now(),
)

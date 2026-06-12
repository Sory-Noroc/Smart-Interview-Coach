package com.sorychan.usercontextualizer.dto

import com.sorychan.usercontextualizer.enums.Role
import java.time.LocalDateTime

class InterviewMessageDTO(
    val id: Long?,
    val content: String,
    val role: Role,
    val createdAt: LocalDateTime
)

package com.sorychan.interviewengine.dto

import com.sorychan.interviewengine.enums.Role
import java.time.LocalDateTime

class InterviewMessageDTO(
    val id: Long?,
    val content: String,
    val role: Role,
    val createdAt: LocalDateTime
)

package com.sorychan.interviewengine.dto

import com.sorychan.interviewengine.enums.InterviewStatus
import java.time.LocalDateTime

data class InterviewSummaryDTO(
    val id: Long,
    val userId: Long,
    val name: String,
    val status: InterviewStatus,
    val createdAt: LocalDateTime
)

package com.sorychan.interviewengine.dto

import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDateTime

data class AIMetricSummaryDTO(
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    val minute: LocalDateTime,
    val totalRequests: Long,
    val successCount: Long,
    val rateLimitCount: Long,
    val errorCount: Long,
    val uniqueUsers: Long
)

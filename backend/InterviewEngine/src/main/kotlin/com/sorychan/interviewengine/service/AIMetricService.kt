package com.sorychan.interviewengine.service

import com.sorychan.interviewengine.data.AIMetric
import com.sorychan.interviewengine.dto.AIMetricSummaryDTO
import com.sorychan.interviewengine.repository.AIMetricRepository
import org.springframework.stereotype.Service
import java.sql.Timestamp
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit

@Service
class AIMetricService(private val aiMetricRepository: AIMetricRepository) {

    fun logMetric(userId: Long?, ipAddress: String, endpoint: String, statusCode: Int) {
        val metric = AIMetric(
            userId = userId,
            ipAddress = ipAddress,
            endpoint = endpoint,
            statusCode = statusCode,
            timestamp = LocalDateTime.now()
        )
        aiMetricRepository.save(metric)
    }

    fun getAllMetrics(): List<AIMetric> {
        return aiMetricRepository.findAll()
    }

    fun getAggregatedMetrics(start: LocalDateTime, end: LocalDateTime): List<AIMetricSummaryDTO> {
        val rawResults = aiMetricRepository.findAggregatedMetrics(start, end)
        
        // Mapam rezultatele din DB intr-un dictionar pentru acces rapid
        val dataMap = rawResults.associate { row ->
            val minute = (row[0] as Timestamp).toLocalDateTime()
            minute to AIMetricSummaryDTO(
                minute = minute,
                totalRequests = (row[1] as Number).toLong(),
                successCount = (row[2] as Number).toLong(),
                rateLimitCount = (row[3] as Number).toLong(),
                errorCount = (row[4] as Number).toLong(),
                uniqueUsers = (row[5] as Number).toLong()
            )
        }

        // Generam lista completa (inclusiv minutele cu 0 cereri)
        val summaries = mutableListOf<AIMetricSummaryDTO>()
        var current = start.truncatedTo(ChronoUnit.MINUTES)
        val limit = end.truncatedTo(ChronoUnit.MINUTES)

        while (!current.isAfter(limit)) {
            summaries.add(dataMap[current] ?: AIMetricSummaryDTO(current, 0, 0, 0, 0, 0))
            current = current.plusMinutes(1)
        }

        return summaries
    }
}

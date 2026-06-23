package com.sorychan.interviewengine.repository

import com.sorychan.interviewengine.data.AIMetric
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.LocalDateTime

@Repository
interface AIMetricRepository : JpaRepository<AIMetric, Long> {
    fun findAllByTimestampBetween(start: LocalDateTime, end: LocalDateTime): List<AIMetric>

    @Query(value = """
        SELECT 
            date_trunc('minute', timestamp) as minute,
            COUNT(*) as totalRequests,
            COUNT(*) FILTER (WHERE status_code = 200) as successCount,
            COUNT(*) FILTER (WHERE status_code = 429) as rateLimitCount,
            COUNT(*) FILTER (WHERE status_code >= 500) as errorCount,
            COUNT(DISTINCT COALESCE(CAST(user_id AS TEXT), ip_address)) as uniqueUsers
        FROM interview.ai_metrics
        WHERE timestamp BETWEEN :start AND :end
        GROUP BY minute
        ORDER BY minute ASC
    """, nativeQuery = true)
    fun findAggregatedMetrics(
        @Param("start") start: LocalDateTime, 
        @Param("end") end: LocalDateTime
    ): List<Array<Any>>
}

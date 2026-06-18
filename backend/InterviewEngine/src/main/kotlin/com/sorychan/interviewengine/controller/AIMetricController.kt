package com.sorychan.interviewengine.controller

import com.sorychan.interviewengine.data.AIMetric
import com.sorychan.interviewengine.dto.AIMetricSummaryDTO
import com.sorychan.interviewengine.service.AIMetricService
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

@RestController
@RequestMapping("/admin/v1/metrics")
class AIMetricController(private val aiMetricService: AIMetricService) {

    @GetMapping
    fun getMetrics(): ResponseEntity<List<AIMetric>> {
        return ResponseEntity.ok(aiMetricService.getAllMetrics())
    }

    @GetMapping("/summary")
    fun getAggregatedMetrics(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) start: LocalDateTime,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) end: LocalDateTime
    ): ResponseEntity<List<AIMetricSummaryDTO>> {
        val metrics = aiMetricService.getAggregatedMetrics(start, end)
        return ResponseEntity.ok(metrics)
    }
}

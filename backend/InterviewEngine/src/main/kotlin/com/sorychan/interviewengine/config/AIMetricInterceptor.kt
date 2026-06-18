package com.sorychan.interviewengine.config

import com.sorychan.interviewengine.service.AIMetricService
import com.sorychan.interviewengine.service.JwtService
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.servlet.HandlerInterceptor
import java.lang.Exception

@Component
class AIMetricInterceptor(
    private val aiMetricService: AIMetricService,
    private val jwtService: JwtService
) : HandlerInterceptor {

    override fun afterCompletion(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handler: Any,
        ex: Exception?
    ) {
        val uri = request.requestURI
        if (uri.contains("/llm/v1/")) {
            val authHeader = request.getHeader("Authorization")
            val userId = if (authHeader != null && authHeader.startsWith("Bearer ")) {
                val jwt = authHeader.substring(7)
                try {
                    jwtService.extractUserId(jwt)
                } catch (e: Exception) {
                    null
                }
            } else {
                null
            }

            val statusCode = response.status
            val ipAddress = request.remoteAddr

            aiMetricService.logMetric(userId, ipAddress, uri, statusCode)
        }
    }
}

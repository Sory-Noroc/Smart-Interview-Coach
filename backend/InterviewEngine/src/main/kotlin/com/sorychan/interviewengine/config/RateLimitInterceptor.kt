package com.sorychan.interviewengine.config

import com.sorychan.interviewengine.service.RateLimitService
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.servlet.HandlerInterceptor

@Component
class RateLimitInterceptor(private val rateLimitService: RateLimitService) : HandlerInterceptor {

    override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {
        if (request.requestURI.contains("/demo/")) return true

        val authentication = SecurityContextHolder.getContext().authentication
        val userId = authentication?.name ?: request.remoteAddr // IP Fallback for unauthenticated users

        if (!rateLimitService.resolveBucket(userId)) {
            response.status = HttpStatus.TOO_MANY_REQUESTS.value()
            response.contentType = "application/json"
            response.writer.write("{\"error\": \"Rate limit exceeded. Please wait a minute.\"}")
            return false
        }

        return true
    }
}

package com.sorychan.usercontextualizer.security

import com.sorychan.usercontextualizer.service.JwtService
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import org.springframework.security.core.authority.SimpleGrantedAuthority

data class UserPrincipal(
    val id: Long,
    val username: String
)

@Component
class JwtAuthenticationFilter(
    private val jwtService: JwtService
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader = request.getHeader("Authorization")
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response)
            return
        }

        val jwt = authHeader.substring(7)
        val username = try {
            jwtService.extractUsername(jwt)
        } catch (e: Exception) {
            null
        }
        val userId = try {
            jwtService.extractUserId(jwt)
        } catch (e: Exception) {
            null
        }

        if (username != null && userId != null && SecurityContextHolder.getContext().authentication == null) {
            if (jwtService.isTokenValid(jwt)) {
                val role = jwtService.extractClaim(jwt) { it["role"]?.toString() }
                val authorities = if (role != null) listOf(SimpleGrantedAuthority(role)) else emptyList()

                val principal = UserPrincipal(userId, username)
                val authToken = UsernamePasswordAuthenticationToken(
                    principal,
                    null,
                    authorities
                )
                authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                SecurityContextHolder.getContext().authentication = authToken
            }
        }
        filterChain.doFilter(request, response)
    }
}

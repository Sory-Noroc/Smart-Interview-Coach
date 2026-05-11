package com.sorychan.uac.service

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.*
import javax.crypto.SecretKey

@Service
class JwtService(
    @Value("\${KEY}")
    private val secret: String,
    
    @Value("\${jwt.expiration:3600000}")
    private val expiration: Long
) {
    private val key: SecretKey = Keys.hmacShaKeyFor(secret.toByteArray())

    fun generateToken(username: String, claims: Map<String, Any> = emptyMap()): String {
        val now = Date()
        val expiryDate = Date(now.time + expiration)

        return Jwts.builder()
            .claims(claims)
            .subject(username)
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(key)
            .compact()
    }
}

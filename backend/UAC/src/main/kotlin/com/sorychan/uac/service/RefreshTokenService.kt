package com.sorychan.uac.service

import com.sorychan.uac.model.RefreshToken
import com.sorychan.uac.model.User
import com.sorychan.uac.repository.RefreshTokenRepository
import com.sorychan.uac.repository.UserRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.*

@Service
class RefreshTokenService(
    private val refreshTokenRepository: RefreshTokenRepository,
    private val userRepository: UserRepository,
    @Value("\${jwt.refreshExpiration:604800000}")
    private val refreshTokenDurationMs: Long
) {

    fun findByToken(token: String) = refreshTokenRepository.findByToken(token)

    @Transactional
    fun createRefreshToken(userId: Long): RefreshToken {
        val user = userRepository.findById(userId)
            .orElseThrow { RuntimeException("User not found with id: $userId") }

        // User and Refresh Token are 1:1, we do token update instead of delete+insert
        val token = user.refreshToken?.apply {
            this.token = UUID.randomUUID().toString()
            this.expiryDate = Instant.now().plusMillis(refreshTokenDurationMs)
        } ?: RefreshToken(
            user = user,
            token = UUID.randomUUID().toString(),
            expiryDate = Instant.now().plusMillis(refreshTokenDurationMs)
        ).also {
            user.refreshToken = it
        }

        return refreshTokenRepository.save(token)
    }

    fun verifyExpiration(token: RefreshToken): RefreshToken {
        if (token.expiryDate < Instant.now()) {
            refreshTokenRepository.delete(token)
            throw RuntimeException("Refresh token was expired. Please make a new signin request")
        }
        return token
    }
}

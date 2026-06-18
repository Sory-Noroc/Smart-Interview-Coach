package com.sorychan.interviewengine.service

import io.github.bucket4j.Bandwidth
import io.github.bucket4j.Bucket
import io.github.bucket4j.Refill
import org.springframework.stereotype.Service
import java.time.Duration
import java.util.concurrent.ConcurrentHashMap

@Service
class RateLimitService {

    private val buckets = ConcurrentHashMap<String, Bucket>()

    fun resolveBucket(key: String): Boolean {
        val bucket = buckets.computeIfAbsent(key) { createNewBucket() }
        return bucket.tryConsume(1)
    }

    private fun createNewBucket(): Bucket {
        val limit = Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(1)))
        return Bucket.builder()
            .addLimit(limit)
            .build()
    }
}

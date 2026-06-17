package com.sorychan.usercontextualizer.data

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "ai_metrics")
class AIMetric(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(name = "user_id")
    var userId: Long? = null,

    @Column(name = "ip_address")
    var ipAddress: String? = null,

    @Column(name = "endpoint")
    var endpoint: String? = null,

    @Column(name = "status_code")
    var statusCode: Int? = null,

    @Column(name = "timestamp", nullable = false)
    var timestamp: LocalDateTime = LocalDateTime.now()
)

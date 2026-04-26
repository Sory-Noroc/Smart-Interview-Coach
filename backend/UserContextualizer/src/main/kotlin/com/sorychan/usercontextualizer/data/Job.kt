package com.sorychan.usercontextualizer.data

import jakarta.persistence.*

@Entity
@Table(name = "jobs")
class Job(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "user_id", nullable = false)
    val userId: Long = 0L,

    @Column(name = "job_name", nullable = false)
    val jobName: String = "",

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    val description: String = ""

)
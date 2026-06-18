package com.sorychan.interviewengine.repository

import com.sorychan.interviewengine.data.Job
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface JobRepository : JpaRepository<Job, Long> {
    fun findJobByUserId(userId: Long): Job?
    fun findJobById(id: Long): MutableList<Job>
}
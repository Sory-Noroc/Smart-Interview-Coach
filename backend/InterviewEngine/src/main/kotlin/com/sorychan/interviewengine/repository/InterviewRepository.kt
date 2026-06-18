package com.sorychan.interviewengine.repository

import com.sorychan.interviewengine.data.Interview
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface InterviewRepository: JpaRepository<Interview, Long> {
    fun findByUserId(userId: Long): List<Interview>
}
package com.sorychan.interviewengine.repository

import com.sorychan.interviewengine.data.InterviewMessage
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface InterviewMessageRepository: JpaRepository<InterviewMessage, Long> {
    fun findMessagesByInterviewId(interviewId: Long): List<InterviewMessage>
}
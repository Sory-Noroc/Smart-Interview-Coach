package com.sorychan.usercontextualizer.repository

import com.sorychan.usercontextualizer.data.CV
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface CVRepository: JpaRepository<CV, Long> {
    @Query("SELECT cv FROM CV cv WHERE cv.userId = :userId ORDER BY cv.createdAt DESC LIMIT 1")
    fun findLatestCVByUserId(userId: Long): CV?
}

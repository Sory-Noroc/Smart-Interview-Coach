package com.sorychan.usercontextualizer.repository

import com.sorychan.usercontextualizer.data.JobDao
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface JobRepository : JpaRepository<JobDao, Long>
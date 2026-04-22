package com.sorychan.usercontextualizer.repository

import com.sorychan.usercontextualizer.data.CV
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CVRepository: JpaRepository<CV, Long>
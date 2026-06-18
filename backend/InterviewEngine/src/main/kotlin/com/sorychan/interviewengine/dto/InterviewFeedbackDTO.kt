package com.sorychan.interviewengine.dto

class InterviewFeedbackDTO(
    val technicalScore: Double,
    val communicationScore: Double,
    val overallGrade: Double,
    val strengths: List<String>,
    val weaknesses: List<String>,
    val improvementTips: List<String>,
    val summary: String
)
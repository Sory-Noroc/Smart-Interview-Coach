package com.sorychan.uac.service

import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service

@Service
class EmailService(
    private val mailSender: JavaMailSender
) {

    @Async
    fun sendVerificationEmail(to: String, token: String) {
        val message = SimpleMailMessage()
        message.setTo(to)
        message.subject = "Account Verification"
        message.text = """
                Hello,
                
                Thank you for registering with JobAcer! 
                Please use the following code to verify your account:
                
                $token
                
                If you did not create an account, please ignore this email.
                
                Sincerely,
                JobAcer Team
            """.trimIndent()
        
        mailSender.send(message)
    }

    @Async
    fun sendPasswordResetEmail(to: String, token: String) {
        val message = SimpleMailMessage()
        message.setTo(to)
        message.subject = "Password Reset Request"
        message.text = """
                Hello,
                
                You requested a password reset. Please use the following token to reset your password:
                
                $token
                
                This token will expire in 1 hour.
                
                If you did not request this, please ignore this email.
                
                Sincerely,
                JobAcer Team
            """.trimIndent()
        
        mailSender.send(message)
    }
}

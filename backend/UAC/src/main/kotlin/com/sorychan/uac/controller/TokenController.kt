package com.sorychan.uac.controller

import com.sorychan.uac.service.JwtService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/uac/v1")
class TokenController(private val jwtService: JwtService) {

    @GetMapping("/create")
    fun createToken(@RequestParam username: String): ResponseEntity<String> {
        val token = jwtService.generateToken(username)
        return ResponseEntity.ok(token)
    }

    @GetMapping("/update")
    fun updateToken(): ResponseEntity<String> {
        return ResponseEntity.notFound().build()
    }
}
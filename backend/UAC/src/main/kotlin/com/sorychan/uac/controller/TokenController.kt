package com.sorychan.uac.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/uac/v1")
class TokenController {

    /**
     * Access Token is a short-lived token used to authenticate and authorize access to protected resources or APIs.
     * Refresh Token is a long-lived token used to obtain a new access token after the current one expires
     * without requiring the user to re-authenticate. It is usually stored securely and is exchanged for a new
     * access token through an endpoint provided by the authentication server. When the access token expires,
     * the client should catch the error (typically a 401 Unauthorized) and use the refresh token to request a
     * new access token from the server.
     */

    @GetMapping("/create")
    fun createToken(): ResponseEntity<String> {
        return ResponseEntity.notFound().build()
    }

    @GetMapping("/update")
    fun updateToken(): ResponseEntity<String> {
        return ResponseEntity.notFound().build()
    }
}
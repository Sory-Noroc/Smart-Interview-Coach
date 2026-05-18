package com.sorychan.uac

import com.fasterxml.jackson.databind.ObjectMapper
import com.sorychan.uac.dto.LoginRequest
import com.sorychan.uac.dto.RegisterRequest
import com.sorychan.uac.repository.UserRepository
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.get


@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthIntegrationTests {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Autowired
    lateinit var userRepository: UserRepository

    @BeforeEach
    fun setup() {
        userRepository.deleteAll()
    }

    @Test
    fun `should register and login user successfully`() {
        val registerRequest = RegisterRequest(
            username = "testuser",
            email = "test@example.com",
            firstName = "Test",
            lastName = "User",
            password = "password123"
        )

        // Register
        mockMvc.post("/uac/v1/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(registerRequest)
        }.andExpect {
            status { isCreated() }
            jsonPath("$.username") { value("testuser") }
        }

        // Login
        val loginRequest = LoginRequest("testuser", "password123")
        val loginResponse = mockMvc.post("/uac/v1/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(loginRequest)
        }.andExpect {
            status { isOk() }
            jsonPath("$.accessToken") { exists() }
        }.andReturn()

        val token = objectMapper.readTree(loginResponse.response.contentAsString).get("accessToken").asText()

        // Access /me with token
        mockMvc.get("/uac/v1/users/me") {
            header("Authorization", "Bearer $token")
        }.andExpect {
            status { isOk() }
            jsonPath("$.username") { value("testuser") }
        }
    }

    @Test
    fun `should fail login with wrong credentials`() {
        val loginRequest = LoginRequest("nonexistent", "wrongpass")
        
        mockMvc.post("/uac/v1/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(loginRequest)
        }.andExpect {
            status { isUnauthorized() }
        }
    }

    @Test
    fun `should restrict admin endpoints for regular users`() {
        // Register regular user
        val registerRequest = RegisterRequest(
            username = "regular",
            email = "reg@example.com",
            firstName = "Reg",
            lastName = "User",
            password = "password123"
        )
        mockMvc.post("/uac/v1/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(registerRequest)
        }

        // Login
        val loginResponse = mockMvc.post("/uac/v1/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(LoginRequest("regular", "password123"))
        }.andReturn()
        
        val token = objectMapper.readTree(loginResponse.response.contentAsString).get("accessToken").asText()

        // Try to access admin endpoint
        mockMvc.get("/uac/v1/admin/users") {
            header("Authorization", "Bearer $token")
        }.andExpect {
            status { isForbidden() }
        }
    }
}

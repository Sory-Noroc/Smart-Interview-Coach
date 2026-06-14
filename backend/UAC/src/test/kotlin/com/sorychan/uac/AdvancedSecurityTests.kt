package com.sorychan.uac

import com.fasterxml.jackson.databind.ObjectMapper
import com.sorychan.uac.dto.ForgotPasswordRequest
import com.sorychan.uac.dto.LoginRequest
import com.sorychan.uac.dto.RegisterRequest
import com.sorychan.uac.dto.ResetPasswordRequest
import com.sorychan.uac.enum.Role
import com.sorychan.uac.repository.UserRepository
import com.sorychan.uac.service.EmailService
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito.anyString
import org.mockito.Mockito.doNothing
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.get
import java.lang.Thread.sleep

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdvancedSecurityTests {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Autowired
    lateinit var userRepository: UserRepository

    @MockitoBean
    lateinit var emailService: EmailService

    @BeforeEach
    fun setup() {
        userRepository.deleteAll()
        doNothing().`when`(emailService).sendPasswordResetEmail(anyString(), anyString())
    }

    @Test
    fun `should fail registration with invalid data`() {
        val invalidRequest = RegisterRequest(
            username = "u",
            email = "not-an-email",
            firstName = "",
            lastName = "",
            password = "123"
        )

        mockMvc.post("/uac/v1/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(invalidRequest)
        }.andExpect {
            status { isBadRequest() }
            jsonPath("$.error") { exists() }
            jsonPath("$.error") { value(org.hamcrest.Matchers.containsString("Username")) }
            jsonPath("$.error") { value(org.hamcrest.Matchers.containsString("Email")) }
            jsonPath("$.error") { value(org.hamcrest.Matchers.containsString("Password")) }
        }
    }

    @Test
    fun `should prevent login for unverified user`() {
        val registerRequest = RegisterRequest("unverified", "unverified@test.com", "U", "V", "password123")
        mockMvc.post("/uac/v1/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(registerRequest)
        }.andExpect {
            status { isCreated() }
        }

        mockMvc.post("/uac/v1/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(LoginRequest("unverified", "password123"))
        }.andExpect {
            status { isUnauthorized() }
        }
    }

    @Test
    fun `should prevent login for disabled user`() {
        val registerRequest = RegisterRequest("blocked", "blocked@test.com", "B", "L", "password123")
        mockMvc.post("/uac/v1/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(registerRequest)
        }

        val user = userRepository.findByUsernameOrEmail("blocked").get()
        user.isVerified = true
        user.isEnabled = false
        userRepository.save(user)

        mockMvc.post("/uac/v1/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(LoginRequest("blocked", "password123"))
        }.andExpect {
            status { isUnauthorized() }
        }
    }

    @Test
    fun `should elevate user role and grant access`() {
        val regRequest = RegisterRequest("elevate", "elevate@test.com", "E", "L", "password123")
        mockMvc.post("/uac/v1/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(regRequest)
        }
        
        val user = userRepository.findByUsernameOrEmail("elevate").get()
        user.isVerified = true
        user.isEnabled = true
        userRepository.save(user)

        val adminUser = com.sorychan.uac.model.User(
            username = "admin",
            email = "admin@test.com",
            firstName = "Admin",
            lastName = "Admin",
            passwordHash = "hashed",
            role = Role.ADMIN
        )
        userRepository.save(adminUser)

        val adminLogin = mockMvc.post("/uac/v1/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(LoginRequest("admin", "hashed"))
        }
        
        val userToElevate = userRepository.findByUsernameOrEmail("elevate").get()

        val userLogin = mockMvc.post("/uac/v1/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(LoginRequest("elevate", "password123"))
        }.andReturn()
        val userToken = objectMapper.readTree(userLogin.response.contentAsString).get("accessToken").asText()

        mockMvc.get("/uac/v1/admin/users") {
            header("Authorization", "Bearer $userToken")
        }.andExpect {
            status { isForbidden() }
        }

        userToElevate.role = Role.ADMIN
        userRepository.save(userToElevate)

        val newUserLogin = mockMvc.post("/uac/v1/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(LoginRequest("elevate", "password123"))
        }.andReturn()
        val newAdminToken = objectMapper.readTree(newUserLogin.response.contentAsString).get("accessToken").asText()

        mockMvc.get("/uac/v1/admin/users") {
            header("Authorization", "Bearer $newAdminToken")
        }.andExpect {
            status { isOk() }
        }
    }

    @Test
    fun `should complete forgot password flow`() {
        val regRequest = RegisterRequest("resetme", "reset@test.com", "R", "E", "oldpass123")
        mockMvc.post("/uac/v1/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(regRequest)
        }

        val userForReset = userRepository.findByUsernameOrEmail("resetme").get()
        userForReset.isVerified = true
        userForReset.isEnabled = true
        userRepository.save(userForReset)

        mockMvc.post("/uac/v1/auth/forgot-password") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(ForgotPasswordRequest("reset@test.com"))
        }.andExpect { status { isOk() } }

        val user = userRepository.findByUsernameOrEmail("resetme").get()
        val token = user.resetToken!!

        mockMvc.post("/uac/v1/auth/reset-password") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(ResetPasswordRequest(token, "newsecurepass"))
        }.andExpect { status { isOk() } }

        mockMvc.post("/uac/v1/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(LoginRequest("resetme", "oldpass123"))
        }.andExpect { status { isUnauthorized() } }

        mockMvc.post("/uac/v1/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(LoginRequest("resetme", "newsecurepass"))
        }.andExpect { status { isOk() } }
    }

    @Test
    fun `should refresh access token using refresh token`() {
        val regRequest = RegisterRequest("refreshuser", "refresh@test.com", "R", "U", "pass123456")
        mockMvc.post("/uac/v1/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(regRequest)
        }

        val user = userRepository.findByUsernameOrEmail("refreshuser").get()
        user.isVerified = true
        user.isEnabled = true
        userRepository.save(user)

        val loginResponse = mockMvc.post("/uac/v1/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(LoginRequest("refreshuser", "pass123456"))
        }.andReturn()

        val loginJson = objectMapper.readTree(loginResponse.response.contentAsString)
        val oldAccessToken = loginJson.get("accessToken").asText()
        val refreshToken = loginJson.get("refreshToken").asText()

        sleep(1000)

        val refreshResponse = mockMvc.post("/uac/v1/auth/refresh") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(mapOf("refreshToken" to refreshToken))
        }.andExpect {
            status { isOk() }
            jsonPath("$.accessToken") { exists() }
        }.andReturn()

        val newAccessToken = objectMapper.readTree(refreshResponse.response.contentAsString).get("accessToken").asText()

        assert(oldAccessToken != newAccessToken)

        mockMvc.get("/uac/v1/users/me") {
            header("Authorization", "Bearer $newAccessToken")
        }.andExpect {
            status { isOk() }
            jsonPath("$.username") { value("refreshuser") }
        }
    }
}

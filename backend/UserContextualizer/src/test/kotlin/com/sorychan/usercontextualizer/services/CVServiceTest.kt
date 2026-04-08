package com.sorychan.usercontextualizer.services

import com.sorychan.usercontextualizer.service.CVService
import io.mockk.*
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.ai.chat.client.ChatClient
import org.springframework.core.io.Resource
import java.io.ByteArrayInputStream

@ExtendWith(MockKExtension::class)
class CVServiceTest {

    @MockK
    lateinit var chatClientBuilder: ChatClient.Builder

    @MockK
    lateinit var chatClient: ChatClient

    private lateinit var cvService: CVService

    @BeforeEach
    fun setUp() {
        every { chatClientBuilder.build() } returns chatClient
        cvService = CVService(chatClientBuilder)
    }

    @Test
    fun `analyzeCV should return summary when AI call is successful`() {
        val cvText = "John Doe, Java Developer with 5 years of experience."
        val expectedSummary = "Professional summary of John Doe."

        val promptSpec = mockk<ChatClient.ChatClientRequestSpec>()
        val callResponseSpec = mockk<ChatClient.CallResponseSpec>()

        every { chatClient.prompt() } returns promptSpec
        every { promptSpec.system(any<String>()) } returns promptSpec
        every { promptSpec.user(cvText) } returns promptSpec
        every { promptSpec.call() } returns callResponseSpec
        every { callResponseSpec.content() } returns expectedSummary

        val result = cvService.analyzeCV(cvText)

        assertEquals(expectedSummary, result)
        verify(exactly = 1) { chatClient.prompt() }
    }

    @Test
    fun `analyzeCV should return empty string when AI response is null`() {
        val promptSpec = mockk<ChatClient.ChatClientRequestSpec>(relaxed = true)
        val callResponseSpec = mockk<ChatClient.CallResponseSpec>()

        every { chatClient.prompt() } returns promptSpec
        every { promptSpec.call() } returns callResponseSpec
        every { callResponseSpec.content() } returns null

        val result = cvService.analyzeCV("Some text")

        assertEquals("", result)
    }

    @Test
    fun `extractTextFromPdf should throw RuntimeException when resource is invalid`() {
        val mockResource = mockk<Resource>()
        every { mockResource.inputStream } throws RuntimeException("File not found")

        assertThrows(RuntimeException::class.java) {
            cvService.extractTextFromPdf(mockResource)
        }
    }
}
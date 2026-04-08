package com.sorychan.usercontextualizer.pdfs

import com.sorychan.usercontextualizer.service.CVService
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.core.io.ClassPathResource

@SpringBootTest
class PDFExtractionIT {

    @Autowired
    private lateinit var cvService: CVService

    @Test
    fun `should extract real text from PDF file`() {
        val resource = ClassPathResource("Overleaf_CV.pdf")

        val text = cvService.extractTextFromPdf(resource)

        assertFalse(text.isBlank())
        assertTrue(text.contains("cloud", ignoreCase = true))
    }
}
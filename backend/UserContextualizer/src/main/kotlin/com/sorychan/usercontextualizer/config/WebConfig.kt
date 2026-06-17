package com.sorychan.usercontextualizer.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig(
    private val rateLimitInterceptor: RateLimitInterceptor,
    private val aiMetricInterceptor: AIMetricInterceptor
) : WebMvcConfigurer {

    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(aiMetricInterceptor)
            .addPathPatterns("/llm/v1/**")

        registry.addInterceptor(rateLimitInterceptor)
            .addPathPatterns("/llm/v1/**")
            .addPathPatterns("/interview/v1/upload-cv")
    }
}

package com.sorychan.usercontextualizer.controller

import org.springframework.ai.chat.client.ChatClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class ContextualizerController {

    private val chatClient: ChatClient

    constructor(chatClientBuilder: ChatClient.Builder) {
        this.chatClient = chatClientBuilder.build()
    }

    @GetMapping("/contextualizer")
    fun getLLMResponse(@RequestParam prompt: String): String? {
        return this.chatClient.prompt()
            .user(prompt)
            .call()
            .content();
    }
}

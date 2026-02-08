package com.sorychan.usercontextualizer

import io.github.cdimascio.dotenv.dotenv
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class UserContextualizerApplication

fun main(args: Array<String>) {
    val dotenv = dotenv()
    dotenv.entries().forEach { entry ->
        System.setProperty(entry.key, entry.value)
    }

    runApplication<UserContextualizerApplication>(*args)
}

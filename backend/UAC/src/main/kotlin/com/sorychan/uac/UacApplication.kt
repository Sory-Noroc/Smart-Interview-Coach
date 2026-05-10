package com.sorychan.uac

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class UacApplication

fun main(args: Array<String>) {
    runApplication<UacApplication>(*args)
}

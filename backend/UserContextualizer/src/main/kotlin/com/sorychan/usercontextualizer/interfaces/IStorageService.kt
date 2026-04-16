package com.sorychan.usercontextualizer.interfaces

import org.springframework.web.multipart.MultipartFile

interface IStorageService {
    fun uploadFile(file: MultipartFile): String
    fun getFileUrl(fileName: String): String
}

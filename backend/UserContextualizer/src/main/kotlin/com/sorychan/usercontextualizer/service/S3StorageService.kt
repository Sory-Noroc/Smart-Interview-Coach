package com.sorychan.usercontextualizer.service

import com.sorychan.usercontextualizer.interfaces.IStorageService
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.PutObjectRequest
import java.util.UUID

@Service
class S3StorageService(
    private val s3Client: S3Client,
    @Value("\${app.s3.bucket}")
    private val bucketName: String
) : IStorageService {

    override fun uploadFile(file: MultipartFile): String {
        val key = "${UUID.randomUUID()}-${file.originalFilename}"

        val putObjectRequest = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(key)
            .contentType(file.contentType)
            .build()

        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.bytes))
        return key
    }

    override fun getFileUrl(fileName: String): String {
        return "https://$bucketName.s3.amazonaws.com/$fileName"
    }
}
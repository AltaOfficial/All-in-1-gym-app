package com.strive.app.services.impl;

import com.strive.app.services.BlobService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.Base64;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BlobServiceImpl implements BlobService {
    private final S3Client s3Client;

    @Value("${storage.s3.bucket}")
    private String bucket;

    @Value("${app.host}")
    private String host;

    @Override
    public String getBlobUrl(String fileName, String base64, String mimeType) {
        String base64Data = base64.contains(",") ? base64.split(",")[1] : base64;
        byte[] bytes = Base64.getDecoder().decode(base64Data);

        String key = UUID.randomUUID() + "." + extension(fileName);

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .contentType(mimeType)
                        .build(),
                RequestBody.fromBytes(bytes));

        return publicBaseUrl() + "/images/" + key;
    }

    @Override
    public ResponseInputStream<GetObjectResponse> getObject(String key) {
        return s3Client.getObject(GetObjectRequest.builder().bucket(bucket).key(key).build());
    }

    private String publicBaseUrl() {
        return host.startsWith("localhost") ? "http://" + host : "https://" + host;
    }

    private static String extension(String fileName) {
        int dot = fileName == null ? -1 : fileName.lastIndexOf('.');
        if (dot < 0 || dot == fileName.length() - 1) {
            return "bin";
        }
        return fileName.substring(dot + 1).toLowerCase(Locale.ROOT);
    }
}

package com.strive.app.services.impl;

import com.azure.core.util.BinaryData;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.models.BlobHttpHeaders;
import com.strive.app.services.BlobService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BlobServiceImpl implements BlobService {
    private final BlobServiceClient blobServiceClient;

    @Value("${spring.cloud.azure.storage.blob.container-name}")
    private String containerName;

    @Override
    public String getBlobUrl(String fileName, String base64, String mimeType) {
        String base64Data = base64.contains(",") ? base64.split(",")[1] : base64;

        byte[] bytes = Base64.getDecoder().decode(base64Data);
        String azureFileName = UUID.randomUUID() + "." + fileName.split("\\.")[1];

        BlobClient blobClient = blobServiceClient
                .getBlobContainerClient(containerName)
                .getBlobClient(azureFileName);

        blobClient.upload(BinaryData.fromBytes(bytes), true);
        blobClient.setHttpHeaders(new BlobHttpHeaders().setContentType(mimeType));

        return blobClient.getBlobUrl();
    }
}

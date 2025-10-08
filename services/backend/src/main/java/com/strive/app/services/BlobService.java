package com.strive.app.services;


public interface BlobService {
    String getBlobUrl(String fileName, String base64, String mimeType);
}

package com.strive.app.services;

import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

public interface BlobService {
    /** Stores a base64-encoded image and returns its permanent public URL. */
    String getBlobUrl(String fileName, String base64, String mimeType);

    /** Opens a stored object by key. Throws NoSuchKeyException if absent. */
    ResponseInputStream<GetObjectResponse> getObject(String key);
}

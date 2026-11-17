package com.strive.app.controllers;

import com.strive.app.services.BlobService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;

import java.time.Duration;
import java.util.regex.Pattern;

/**
 * Serves stored images from the private bucket. Keys are random UUIDs, so a URL
 * is unguessable; this matches the previous public Azure container's access model.
 */
@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
public class ImageController {
    private static final Pattern KEY = Pattern.compile("^[0-9a-fA-F-]{36}\\.[A-Za-z0-9]{1,10}$");

    private final BlobService blobService;

    @GetMapping("/{key:.+}")
    public ResponseEntity<InputStreamResource> getImage(@PathVariable String key) {
        if (!KEY.matcher(key).matches()) {
            return ResponseEntity.notFound().build();
        }
        try {
            ResponseInputStream<GetObjectResponse> object = blobService.getObject(key);
            GetObjectResponse meta = object.response();
            MediaType type = meta.contentType() != null
                    ? MediaType.parseMediaType(meta.contentType())
                    : MediaType.APPLICATION_OCTET_STREAM;

            var builder = ResponseEntity.ok()
                    .contentType(type)
                    .cacheControl(CacheControl.maxAge(Duration.ofDays(365)).cachePublic().immutable());
            if (meta.contentLength() != null) {
                builder.contentLength(meta.contentLength());
            }
            return builder.body(new InputStreamResource(object));
        } catch (NoSuchKeyException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

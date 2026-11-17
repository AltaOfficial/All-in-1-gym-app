package com.strive.app.migration;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.regex.Pattern;

/**
 * One-off copy of images from the public Azure Blob container into the S3 bucket.
 * Each object keeps its key; each database URL is rewritten to the /images endpoint
 * only after its object is stored. Rows whose copy fails keep their Azure URL.
 * Runs at startup when app.migrate-azure-images=true (MIGRATE_AZURE_IMAGES).
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.migrate-azure-images", havingValue = "true")
public class AzureImageMigration implements ApplicationRunner {

    private static final String AZURE_PREFIX = "https://striveapp.blob.core.windows.net/strive-image-container/";
    private static final Pattern KEY = Pattern.compile("^[0-9a-fA-F-]{36}\\.[A-Za-z0-9]{1,10}$");

    private static final List<String[]> COLUMNS = List.of(
            new String[]{"bodymetricslogs", "front_photo_url"},
            new String[]{"bodymetricslogs", "side_photo_url"},
            new String[]{"meals", "meal_image_url"},
            new String[]{"exercises", "exercise_image_url"},
            new String[]{"foods", "food_image_url"});

    private final JdbcTemplate jdbc;
    private final S3Client s3Client;

    @Value("${storage.s3.bucket}")
    private String bucket;

    @Value("${app.host}")
    private String host;

    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    @Override
    public void run(ApplicationArguments args) {
        String base = (host.startsWith("localhost") ? "http://" : "https://") + host + "/images/";
        int copied = 0, failed = 0, rows = 0;

        for (String[] tc : COLUMNS) {
            String table = tc[0], column = tc[1];
            List<String> urls = jdbc.queryForList(
                    "SELECT DISTINCT " + column + " FROM " + table + " WHERE " + column + " LIKE ?",
                    String.class, AZURE_PREFIX + "%");

            for (String url : urls) {
                String key = url.substring(AZURE_PREFIX.length());
                if (!KEY.matcher(key).matches()) {
                    log.warn("Azure image migration: skipping unexpected key {}", key);
                    failed++;
                    continue;
                }
                try {
                    HttpResponse<byte[]> res = http.send(
                            HttpRequest.newBuilder(URI.create(url)).timeout(Duration.ofSeconds(60)).GET().build(),
                            HttpResponse.BodyHandlers.ofByteArray());
                    if (res.statusCode() != 200) {
                        log.warn("Azure image migration: {} returned HTTP {}", key, res.statusCode());
                        failed++;
                        continue;
                    }
                    String contentType = res.headers().firstValue("Content-Type").orElse("application/octet-stream");
                    s3Client.putObject(
                            PutObjectRequest.builder().bucket(bucket).key(key).contentType(contentType).build(),
                            RequestBody.fromBytes(res.body()));
                    rows += jdbc.update(
                            "UPDATE " + table + " SET " + column + " = ? WHERE " + column + " = ?",
                            base + key, url);
                    copied++;
                } catch (Exception e) {
                    log.warn("Azure image migration: failed for {}: {}", key, e.toString());
                    failed++;
                }
            }
        }
        log.info("Azure image migration finished: {} objects copied, {} rows updated, {} failed", copied, rows, failed);
    }
}

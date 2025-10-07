package com.strive.app.controllers;

import com.strive.app.domain.dto.BodyMetricsLogDto;
import com.strive.app.domain.dto.BodyMetricsLogRequestDto;
import com.strive.app.domain.entities.BodyMetricsId;
import com.strive.app.domain.entities.BodyMetricsLogEntity;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.services.AuthenticationService;
import com.strive.app.services.BodyMetricsService;
import com.strive.app.services.UserService;
import com.strive.app.services.BlobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping(path = "/bodymetrics")
@RequiredArgsConstructor
public class BodyMetricsLogsController {

    private final AuthenticationService authenticationService;
    private final BodyMetricsService bodyMetricsService;
    private final UserService userService;
    private final Mapper<BodyMetricsLogEntity, BodyMetricsLogDto> bodyMetricsMapper;
    private final BlobService blobService;

    @PostMapping("/log")
    public ResponseEntity<BodyMetricsLogDto> logBodyMetrics(
            @RequestHeader("Authorization") String jwtToken,
            @RequestBody BodyMetricsLogRequestDto requestDto) {

        if (jwtToken.startsWith("Bearer ")) {
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            UserEntity userEntity = userService.findByEmail(userDetails.getUsername());

            // Process front photo through BlobService if metadata is present
            String frontPhotoUrl = null;
            if (requestDto.getFrontPhotoFileName() != null && requestDto.getFrontPhotoBase64() != null && requestDto.getFrontPhotoMimeType() != null) {
                frontPhotoUrl = blobService.getBlobUrl(requestDto.getFrontPhotoFileName(), requestDto.getFrontPhotoBase64(), requestDto.getFrontPhotoMimeType());
            }

            // Process side photo through BlobService if metadata is present
            String sidePhotoUrl = null;
            if (requestDto.getSidePhotoFileName() != null && requestDto.getSidePhotoBase64() != null && requestDto.getSidePhotoMimeType() != null) {
                sidePhotoUrl = blobService.getBlobUrl(requestDto.getSidePhotoFileName(), requestDto.getSidePhotoBase64(), requestDto.getSidePhotoMimeType());
            }

            BodyMetricsLogEntity bodyMetricsLogEntity = BodyMetricsLogEntity.builder()
                    .id(BodyMetricsId.builder()
                            .userId(userEntity.getId())
                            .build())
                    .user(userEntity)
                    .frontPhotoUrl(frontPhotoUrl)
                    .sidePhotoUrl(sidePhotoUrl)
                    .weight(requestDto.getWeight())
                    .bodyFat(requestDto.getBodyFat())
                    .shouldersCircumference(requestDto.getShouldersCircumference())
                    .neckCircumference(requestDto.getNeckCircumference())
                    .waistCircumference(requestDto.getWaistCircumference())
                    .chestCircumference(requestDto.getChestCircumference())
                    .hipCircumference(requestDto.getHipCircumference())
                    .leftBicepCircumference(requestDto.getLeftBicepCircumference())
                    .rightBicepCircumference(requestDto.getRightBicepCircumference())
                    .rightCalfCircumference(requestDto.getRightCalfCircumference())
                    .leftCalfCircumference(requestDto.getLeftCalfCircumference())
                    .leftThighCircumference(requestDto.getLeftThighCircumference())
                    .rightThighCircumference(requestDto.getRightThighCircumference())
                    .build();

            BodyMetricsLogEntity savedEntity = bodyMetricsService.save(bodyMetricsLogEntity);
            BodyMetricsLogDto responseDto = bodyMetricsMapper.mapTo(savedEntity);

            return ResponseEntity.ok(responseDto);
        }

        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/logsByDateRange")
    public ResponseEntity<List<BodyMetricsLogDto>> getLogsByDateRange(
            @RequestHeader("Authorization") String jwtToken,
            @RequestBody BodyMetricsLogRequestDto requestDto) {

        if (jwtToken.startsWith("Bearer ")) {
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            UserEntity userEntity = userService.findByEmail(userDetails.getUsername());

            List<BodyMetricsLogEntity> bodyMetricsLogs;

            if (requestDto.getStartDate() != null && requestDto.getEndDate() != null) {
                bodyMetricsLogs = bodyMetricsService.findAllByUserIdAndDateRange(
                        userEntity.getId(), requestDto.getStartDate(), requestDto.getEndDate());
            } else {
                bodyMetricsLogs = bodyMetricsService.findAllByUserId(userEntity.getId());
            }

            List<BodyMetricsLogDto> responseDtos = bodyMetricsLogs.stream()
                    .map(bodyMetricsMapper::mapTo)
                    .toList();

            return ResponseEntity.ok(responseDtos);
        }

        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/todaysLog")
    public ResponseEntity<BodyMetricsLogDto> getTodaysLog(@RequestParam(name = "latest", required = false) Boolean latest,
            @RequestHeader("Authorization") String jwtToken) {

        if (jwtToken.startsWith("Bearer ")) {
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            UserEntity userEntity = userService.findByEmail(userDetails.getUsername());

            if(latest != null && latest){
                try {
                    BodyMetricsLogEntity bodyMetricsLogEntity = bodyMetricsService.findFirstByIdUserIdOrderByIdDateDesc(userEntity.getId());
                    if(bodyMetricsLogEntity == null){
                        throw new NoSuchElementException();
                    }
                    BodyMetricsLogDto responseDto = bodyMetricsMapper.mapTo(bodyMetricsLogEntity);

                    return ResponseEntity.ok(responseDto);
                } catch (NoSuchElementException ex) {
                    // Return null if no metrics found for today
                    return ResponseEntity.ok(null);
                }
            }

            try {
                BodyMetricsId bodyMetricsId = BodyMetricsId.builder()
                        .userId(userEntity.getId())
                        .date(LocalDate.now())
                        .build();

                BodyMetricsLogEntity bodyMetricsLogEntity = bodyMetricsService.findOne(bodyMetricsId);
                BodyMetricsLogDto responseDto = bodyMetricsMapper.mapTo(bodyMetricsLogEntity);

                return ResponseEntity.ok(responseDto);
            } catch (NoSuchElementException ex) {
                // Return null if no metrics found for today
                return ResponseEntity.ok(null);
            }
        }

        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/recentPhotos")
    public ResponseEntity<List<String>> getRecentPhotos(
            @RequestParam(name = "limit", required = false, defaultValue = "4") Integer limit,
            @RequestHeader("Authorization") String jwtToken) {

        if (jwtToken.startsWith("Bearer ")) {
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            UserEntity userEntity = userService.findByEmail(userDetails.getUsername());

            // Get recent body metrics logs with photos
            List<BodyMetricsLogEntity> recentLogs = bodyMetricsService.findAllByUserId(userEntity.getId());

            // Extract photo URLs (both front and side) and limit results
            List<String> photoUrls = recentLogs.stream()
                    .flatMap(log -> {
                        java.util.List<String> urls = new java.util.ArrayList<>();
                        if (log.getFrontPhotoUrl() != null) {
                            urls.add(log.getFrontPhotoUrl());
                        }
                        if (log.getSidePhotoUrl() != null) {
                            urls.add(log.getSidePhotoUrl());
                        }
                        return urls.stream();
                    })
                    .limit(limit)
                    .toList();

            return ResponseEntity.ok(photoUrls);
        }

        return ResponseEntity.badRequest().build();
    }
}

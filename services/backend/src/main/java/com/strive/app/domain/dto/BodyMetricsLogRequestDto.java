package com.strive.app.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BodyMetricsLogRequestDto {

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate date;

    // Front Photo
    private String frontPhotoUrl;
    private String frontPhotoFileName;
    private String frontPhotoBase64;
    private String frontPhotoMimeType;

    // Side Photo
    private String sidePhotoUrl;
    private String sidePhotoFileName;
    private String sidePhotoBase64;
    private String sidePhotoMimeType;

    // Basic body metrics
    private Double weight;
    private Double bodyFat;
    private Double shouldersCircumference;
    private Double neckCircumference;
    private Double waistCircumference;
    private Double chestCircumference;
    private Double hipCircumference;
    private Double leftBicepCircumference;
    private Double rightBicepCircumference;
    private Double rightCalfCircumference;
    private Double leftCalfCircumference;
    private Double leftThighCircumference;
    private Double rightThighCircumference;
}

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

    // Photos
    private String frontPhotoUrl;
    private String sidePhotoUrl;

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

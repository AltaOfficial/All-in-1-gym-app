package com.strive.app.domain.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.strive.app.domain.entities.BodyMetricsId;
import com.strive.app.domain.entities.UserEntity;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BodyMetricsLogDto {

    private BodyMetricsId id;

    @JsonBackReference
    @ToString.Exclude
    private UserEntity user;

    // photos
    private String frontPhotoUrl;
    private String sidePhotoUrl;

    // basic body metrics
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

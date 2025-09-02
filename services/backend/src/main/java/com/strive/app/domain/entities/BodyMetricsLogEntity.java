package com.strive.app.domain.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bodymetricslogs")
public class BodyMetricsLogEntity {

    @EmbeddedId
    private BodyMetricsId id;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    @ToString.Exclude
    private UserEntity user;

    // basic body metrics
    private Double weight;             // in kg or lbs (decide based on your app units)
    private Double bodyFat;            // percentage
    private Double shouldersCircumference;
    private Double neckCircumference;
    private Double waistCircumference; // cm/in
    private Double chestCircumference; // cm/in
    private Double hipCircumference;   // cm/in
    private Double leftBicepCircumference;
    private Double rightBicepCircumference;
    private Double rightCalfCircumference;
    private Double leftCalfCircumference;
    private Double leftThighCircumference;
    private Double rightThighCircumference;
}

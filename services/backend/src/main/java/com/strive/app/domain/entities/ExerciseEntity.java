package com.strive.app.domain.entities;

import jakarta.persistence.*;
import lombok.*;

import java.net.URL;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "exercises")
public class ExerciseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String exerciseName;
    private URL exerciseImageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    private WorkoutEntity workoutConnectedTo;

    private Integer restTimeInSeconds;
    private Integer goalSets;
    private Integer goalReps;

    private Boolean isWeightBased;
    private Double weight;
    private Integer time;

    private URL tutorialUrl;

    @OneToMany(mappedBy = "exerciseParent", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<ExerciseLogEntity> exerciseLogs;
}

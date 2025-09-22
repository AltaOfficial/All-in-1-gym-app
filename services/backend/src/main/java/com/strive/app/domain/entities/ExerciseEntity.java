package com.strive.app.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private WorkoutEntity workoutConnectedTo;

    private Integer restTimeInSeconds;
    private Integer goalSets;
    private Integer goalReps;

    private Boolean isWeightBased;
    private Double weight;
    private Integer time;

    private URL tutorialUrl;

    @OneToMany(mappedBy = "exerciseParent", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ExerciseLogEntity> exerciseLogs;
}

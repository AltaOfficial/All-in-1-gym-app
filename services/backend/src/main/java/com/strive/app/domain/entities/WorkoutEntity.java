package com.strive.app.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "workouts")
public class WorkoutEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    private UserEntity userCreatedBy;

    private String workoutName;

    @OneToMany(mappedBy = "workoutConnectedTo", orphanRemoval = true, cascade = CascadeType.ALL)
    @OrderColumn(name = "exercise_order")
    private List<ExerciseEntity> exercises = new ArrayList<>();
}

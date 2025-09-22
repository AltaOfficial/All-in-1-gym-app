package com.strive.app.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "exerciselogs")
public class ExerciseLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    private ExerciseEntity exerciseParent;

    private Date date;

    @ElementCollection
    @CollectionTable(name = "exercise_sets", joinColumns = @JoinColumn(name = "exercise_log_id"))
    private List<ExerciseSet> setsList;

    private Double weight;
    private Integer time;
}

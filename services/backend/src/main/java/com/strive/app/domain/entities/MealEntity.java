package com.strive.app.domain.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.net.URL;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "meals")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MealEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private URL mealImageUrl;

    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @ToString.Exclude
    private UserEntity userCreatedBy;

    @Column(nullable = false)
    private String mealName;

    @OneToMany(mappedBy = "mealConnectedTo", cascade = CascadeType.ALL)
    @JsonManagedReference
    @ToString.Exclude
    private List<FoodEntity> foodItems;
}

package com.strive.app.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @OneToMany(
            cascade = CascadeType.ALL, // PERSIST, MERGE, REMOVE, REFRESH, DETACH happens to all the children as well
            mappedBy = "userEntity",
            orphanRemoval = true, // deletes child when no longer connected to parent
            fetch = FetchType.LAZY
    )
    private List<WidgetEntity> widgets = new ArrayList<>();
}

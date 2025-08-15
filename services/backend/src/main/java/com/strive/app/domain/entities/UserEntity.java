package com.strive.app.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_id_seq")
    private Long Id;

    private String name;

    @Column(unique = true)
    private String email;

    @OneToMany(
            cascade = CascadeType.ALL, // PERSIST, MERGE, REMOVE, REFRESH, DETACH happens to all the children as well
            mappedBy = "userEntity",
            orphanRemoval = true, // deletes child when no longer connected to parent
            fetch = FetchType.LAZY
    )
    private List<WidgetEntity> widgets = new ArrayList<>();
}

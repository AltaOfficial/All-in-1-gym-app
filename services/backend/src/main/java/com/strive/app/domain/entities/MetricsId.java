package com.strive.app.domain.entities;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MetricsId implements Serializable {
    private UUID userId;
    @Builder.Default
    private LocalDate date = LocalDate.now(); // uses date of server instead of user timezone, edge cases will occur

}

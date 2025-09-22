package com.strive.app.domain.entities;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FoodLogId implements Serializable {
    private UUID userId;
    @Builder.Default
    private LocalDate date = LocalDate.now(); // TODO: uses date of server instead of user timezone, edge cases will occur on client side

}

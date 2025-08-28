package com.strive.app.domain.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PortionEmb {
    @Column(nullable = false)
    private Double size;     // 240.0
    @Column(nullable = false)
    private String unit;     // "ml", "g", "piece"

    private Double grams;
}

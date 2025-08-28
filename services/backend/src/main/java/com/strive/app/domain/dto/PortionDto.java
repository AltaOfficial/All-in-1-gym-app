package com.strive.app.domain.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PortionDto {
    private Double size;
    private String unit;
    private Double grams;
}
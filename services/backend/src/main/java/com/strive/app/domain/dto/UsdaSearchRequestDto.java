package com.strive.app.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UsdaSearchRequestDto {

    private String query;
    @Builder.Default
    private List<String> dataType = List.of("Branded", "Foundation");      // categories
    @Builder.Default
    private Integer pageSize = 50;           // default USDA API max = 50
    @Builder.Default
    private Integer pageNumber = 1;         // page index

}

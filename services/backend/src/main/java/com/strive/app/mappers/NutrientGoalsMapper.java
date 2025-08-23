package com.strive.app.mappers;

import com.strive.app.domain.dto.NutrientGoalsDto;
import com.strive.app.domain.entities.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface NutrientGoalsMapper {
    void updateUserWithGoals(NutrientGoalsDto goals, @MappingTarget UserEntity user);
}

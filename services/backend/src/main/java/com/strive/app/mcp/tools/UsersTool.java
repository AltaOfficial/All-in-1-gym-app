package com.strive.app.mcp.tools;

import com.strive.app.domain.dto.UserDto;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UsersTool {

    private final CurrentUserProvider currentUser;
    private final Mapper<UserEntity, UserDto> userMapper;

    @McpTool(name = "getMyProfile",
            description = "Get the current user's profile and daily nutrition goals: name, age, height, "
                    + "weight and its unit, sex, training experience, main goal, and target calories, protein, "
                    + "carbs, fat, fiber, sugar, sodium, and other nutrients. Does not include saved foods, "
                    + "meals, or recipes - use their dedicated tools for those.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true))
    public UserDto getMyProfile() {
        UserEntity me = currentUser.require();
        UserDto dto = userMapper.mapTo(me);
        // Each has its own dedicated tool; leaving them populated here would blow up the
        // response for no reason. Password is excluded at the DTO level (write-only).
        dto.setRecentFoods(null);
        dto.setMeals(null);
        dto.setFoods(null);
        dto.setRecipes(null);
        return dto;
    }
}

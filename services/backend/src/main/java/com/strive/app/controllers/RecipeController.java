package com.strive.app.controllers;

import com.strive.app.domain.dto.FoodDto;
import com.strive.app.domain.dto.RecipeDto;
import com.strive.app.domain.entities.FoodEntity;
import com.strive.app.domain.entities.RecipeEntity;
import com.strive.app.domain.entities.RecipeId;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.services.AuthenticationService;
import com.strive.app.services.RecipeService;
import com.strive.app.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/recipes")
@RequiredArgsConstructor
public class RecipeController {
    private final RecipeService recipeService;
    private final UserService userService;
    private final AuthenticationService authenticationService;
    private final Mapper<RecipeEntity, RecipeDto> recipeMapper;
    private final Mapper<FoodEntity, FoodDto> foodMapper;

    @PostMapping(path = "/create")
    public ResponseEntity<RecipeDto> createRecipe(@RequestBody RecipeDto recipeDto, @RequestHeader("Authorization") String jwtToken) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
        RecipeEntity recipeEntity = recipeMapper.mapFrom(recipeDto);

        System.out.println(recipeEntity);

        // Set the userId in the RecipeId
        recipeEntity.setId(RecipeId.builder()
                .userId(userEntity.getId())
                .build());
        
        RecipeEntity recipeEntitySaved = recipeService.save(recipeEntity);

        return ResponseEntity.ok(recipeMapper.mapTo(recipeEntitySaved));
    }

    @GetMapping(path = "/userrecipes")
    public ResponseEntity<List<RecipeDto>> getAllRecipesByUser(@RequestHeader("Authorization") String jwtToken) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
        List<RecipeEntity> recipeEntities = recipeService.findAllByUserId(userEntity.getId());

        List<RecipeDto> recipeDtos = recipeEntities.stream().map(recipeMapper::mapTo).toList();
        return ResponseEntity.ok(recipeDtos);
    }

    @PostMapping(path = "/update")
    public ResponseEntity<RecipeDto> updateRecipe(@RequestBody RecipeDto recipeDto, @RequestHeader("Authorization") String jwtToken) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
        
        RecipeId recipeId = RecipeId.builder()
                .id(recipeDto.getId())
                .userId(userEntity.getId())
                .build();
        
        recipeService.findById(recipeId);
        RecipeEntity recipeEntity = recipeMapper.mapFrom(recipeDto);
        recipeEntity.setId(recipeId);
        RecipeEntity updatedRecipeEntity = recipeService.save(recipeEntity);

        return ResponseEntity.ok(recipeMapper.mapTo(updatedRecipeEntity));
    }

    @PostMapping(path = "/delete")
    public ResponseEntity<Boolean> deleteRecipe(@RequestBody RecipeDto recipeDto, @RequestHeader("Authorization") String jwtToken) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());

        recipeService.deleteRecipe(RecipeId.builder()
                .id(recipeDto.getId())
                .userId(userEntity.getId())
                .build());
        return ResponseEntity.ok(true);
    }
}

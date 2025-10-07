package com.strive.app.controllers;

import com.strive.app.domain.dto.MealDto;
import com.strive.app.domain.dto.MealRequestDto;
import com.strive.app.domain.entities.MealEntity;
import com.strive.app.domain.entities.MealId;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.services.AuthenticationService;
import com.strive.app.services.BlobService;
import com.strive.app.services.MealService;
import com.strive.app.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/meals")
@RequiredArgsConstructor
public class MealController {
    private final MealService mealService;
    private final UserService userService;
    private final AuthenticationService authenticationService;
    private final Mapper<MealEntity, MealDto> mealMapper;
    private final BlobService blobService;

    @PostMapping(path = "/create")
    public ResponseEntity<MealDto> createMeal(@RequestBody MealRequestDto mealRequestDto, @RequestHeader("Authorization") String jwtToken) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());

        // Map request DTO to meal DTO
        MealDto mealDto = MealDto.builder()
                .mealName(mealRequestDto.getMealName())
                .foodItems(mealRequestDto.getFoodItems())
                .build();

        MealEntity mealEntity = mealMapper.mapFrom(mealDto);

        // Process meal image through BlobService if metadata is present
        addBlobUrlToEntity(mealRequestDto, mealEntity);

        // Set the userId in the MealId
        mealEntity.setId(MealId.builder()
                .userId(userEntity.getId())
                .build());

        MealEntity mealEntitySaved = mealService.save(mealEntity);

        return ResponseEntity.ok(mealMapper.mapTo(mealEntitySaved));
    }

    @GetMapping(path = "/usermeals")
    public ResponseEntity<List<MealDto>> getAllMealsByUser(@RequestHeader("Authorization") String jwtToken) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
        List<MealEntity> mealEntities = mealService.findAllByUserId(userEntity.getId());

        List<MealDto> mealDtos = mealEntities.stream().map(mealMapper::mapTo).toList();
        return ResponseEntity.ok(mealDtos);
    }

    @PostMapping(path = "/update")
    public ResponseEntity<MealDto> updateMeal(@RequestBody MealRequestDto mealRequestDto, @RequestHeader("Authorization") String jwtToken) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());

        MealId mealId = MealId.builder()
                .id(mealRequestDto.getId())
                .userId(userEntity.getId())
                .build();

        mealService.findById(mealId);

        // Map request DTO to meal DTO
        MealDto mealDto = MealDto.builder()
                .id(mealRequestDto.getId())
                .mealName(mealRequestDto.getMealName())
                .foodItems(mealRequestDto.getFoodItems())
                .build();

        MealEntity mealEntity = mealMapper.mapFrom(mealDto);
        mealEntity.setId(mealId);

        // Process meal image through BlobService if metadata is present
        addBlobUrlToEntity(mealRequestDto, mealEntity);

        MealEntity updatedMealEntity = mealService.save(mealEntity);

        return ResponseEntity.ok(mealMapper.mapTo(updatedMealEntity));
    }

    @PostMapping(path = "/delete")
    public ResponseEntity<Boolean> deleteMeal(@RequestBody MealDto mealDto, @RequestHeader("Authorization") String jwtToken) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());

        mealService.deleteMeal(MealId.builder()
                .id(mealDto.getId())
                .userId(userEntity.getId())
                .build());
        return ResponseEntity.ok(true);
    }

    private void addBlobUrlToEntity(@RequestBody MealRequestDto mealRequestDto, MealEntity mealEntity) {
        if (mealRequestDto.getMealImageFileName() != null &&
                mealRequestDto.getMealImageBase64() != null &&
                mealRequestDto.getMealImageMimeType() != null) {
            String imageUrl = blobService.getBlobUrl(
                    mealRequestDto.getMealImageFileName(),
                    mealRequestDto.getMealImageBase64(),
                    mealRequestDto.getMealImageMimeType()
            );
            try {
                mealEntity.setMealImageUrl(URI.create(imageUrl).toURL());
            } catch (Exception e) {
                System.err.println("Invalid meal image URL: " + imageUrl);
            }
        }
    }
}

package com.strive.app.controllers;

import com.strive.app.domain.dto.*;
import com.strive.app.domain.entities.*;
import com.strive.app.services.AuthenticationService;
import com.strive.app.services.GroceryListService;
import com.strive.app.services.UserService;
import com.strive.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping(path = "/grocerylist")
@RequiredArgsConstructor
@Slf4j
public class GroceryListController {
    private final GroceryListService groceryListService;
    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final Mapper<GroceryListItemEntity, GroceryListItemDto> groceryListItemMapper;

    @PostMapping
    public List<GroceryListItemDto> getGroceryList(@RequestBody GroceryListRequestDto groceryListRequestDto,
            @RequestHeader("Authorization") String jwtToken) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());

        GroceryListId groceryListId = GroceryListId.builder().userId(userEntity.getId())
                .dateFrom(groceryListRequestDto.getDateFrom()).dateTo(groceryListRequestDto.getDateTo()).build();
        try {
            GroceryListEntity groceryListEntity = groceryListService.findById(groceryListId);
            return groceryListEntity.getGroceryListItems().stream().map(groceryListItemMapper::mapTo).toList();
        } catch (NoSuchElementException exception) {
            return List.of();
        }
    }

    @PostMapping(path = "/add")
    public List<GroceryListItemDto> addToGroceryList(@RequestBody GroceryListRequestDto groceryListRequestDto,
            @RequestHeader("Authorization") String jwtToken) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
        checkIfGroceryListExistsElseCreate(groceryListRequestDto, userEntity);

        GroceryListId groceryListId = GroceryListId.builder().userId(userEntity.getId())
                .dateFrom(groceryListRequestDto.getDateFrom()).dateTo(groceryListRequestDto.getDateTo()).build();
        GroceryListEntity groceryListEntity = groceryListService.addToGroceryList(groceryListId,
                groceryListItemMapper.mapFrom(groceryListRequestDto.getGroceryListItemDto()));
        return groceryListEntity.getGroceryListItems().stream().map(groceryListItemMapper::mapTo).toList();
    }

    @PostMapping(path = "/remove")
    public List<GroceryListItemDto> removeFromGroceryList(@RequestBody GroceryListRequestDto groceryListRequestDto,
            @RequestHeader("Authorization") String jwtToken) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
        Boolean listExists = checkIfGroceryListExistsElseCreate(groceryListRequestDto, userEntity);
        if(!listExists) {
            return List.of();
        }

        GroceryListId groceryListId = GroceryListId.builder().userId(userEntity.getId())
                .dateFrom(groceryListRequestDto.getDateFrom()).dateTo(groceryListRequestDto.getDateTo()).build();
        GroceryListEntity groceryListEntity = groceryListService.removeFromGroceryList(groceryListId,
                groceryListItemMapper.mapFrom(groceryListRequestDto.getGroceryListItemDto()));
        return groceryListEntity.getGroceryListItems().stream().map(groceryListItemMapper::mapTo).toList();
    }

    @PostMapping(path = "/bought")
    public List<GroceryListItemDto> updateGroceryListItem(@RequestBody GroceryListRequestDto groceryListRequestDto,
            @RequestHeader("Authorization") String jwtToken) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
        Boolean listExists = checkIfGroceryListExistsElseCreate(groceryListRequestDto, userEntity);
        if(!listExists) {
            return List.of();
        }

        // Update the item's bought status
        groceryListService.setItemIsBought(groceryListRequestDto.getGroceryListItemDto().getIsBought(),
                groceryListRequestDto.getGroceryListItemDto().getId());

        // Return the updated grocery list for the date range
        GroceryListId groceryListId = GroceryListId.builder().userId(userEntity.getId())
                .dateFrom(groceryListRequestDto.getDateFrom()).dateTo(groceryListRequestDto.getDateTo()).build();
        try {
            GroceryListEntity groceryListEntity = groceryListService.findById(groceryListId);
            return groceryListEntity.getGroceryListItems().stream().map(groceryListItemMapper::mapTo).toList();
        } catch (NoSuchElementException exception) {
            return List.of();
        }
    }

    private Boolean checkIfGroceryListExistsElseCreate(GroceryListRequestDto groceryListRequestDto,
            UserEntity userEntity) {
        GroceryListId groceryListId = GroceryListId.builder().userId(userEntity.getId())
                .dateFrom(groceryListRequestDto.getDateFrom()).dateTo(groceryListRequestDto.getDateTo()).build();
        try {
            groceryListService.findById(groceryListId);
            return true;
        } catch (NoSuchElementException exception) {
            GroceryListEntity groceryListEntity = groceryListService.save(GroceryListEntity.builder().user(userEntity)
                    .id(groceryListId)
                    .build());
            return false;
        }
    }

    @PostMapping("/logsByDateRange")
    public ResponseEntity<List<GroceryListItemDto>> getGrocerListItemsByDateRange(
            @RequestHeader("Authorization") String jwtToken,
            @RequestBody GroceryListRequestDto requestDto) {

        if (jwtToken.startsWith("Bearer ")) {
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            UserEntity userEntity = userService.findByEmail(userDetails.getUsername());

            List<GroceryListItemEntity> groceryListItemEntities;

            if (requestDto.getDateFrom() != null && requestDto.getDateTo() != null) {
                groceryListItemEntities = groceryListService.findAllByUserIdAndDateRange(
                        userEntity.getId(), requestDto.getDateFrom(), requestDto.getDateTo());
            } else {
                return ResponseEntity.badRequest().build();
            }

            List<GroceryListItemDto> responseDtos = groceryListItemEntities.stream()
                    .map(groceryListItemMapper::mapTo)
                    .toList();

            return ResponseEntity.ok(responseDtos);
        }

        return ResponseEntity.badRequest().build();
    }
}

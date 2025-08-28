package com.strive.app.controllers;

import com.strive.app.domain.dto.MetricRequestDto;
import com.strive.app.domain.dto.MetricsDto;
import com.strive.app.domain.entities.MetricsEntity;
import com.strive.app.domain.entities.MetricsId;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.mappers.Mapper;
import com.strive.app.services.AuthenticationService;
import com.strive.app.services.MetricsService;
import com.strive.app.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping(path = "/metrics")
@RequiredArgsConstructor
public class MetricsController {
    private final AuthenticationService authenticationService;
    private final MetricsService metricsService;
    private final UserService userService;
    private final Mapper<MetricsEntity, MetricsDto> metricsMapper;

    @GetMapping("/daily")
    public ResponseEntity<MetricsDto> dailyMetrics(@RequestHeader("Authorization") String jwtToken) {
        if(jwtToken.startsWith("Bearer ")) {
            UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
            UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
            try {
                // find existing metrics for today
                System.out.println(metricsService.findOne(MetricsId.builder().userId(userEntity.getId()).build()));
                MetricsEntity metricsEntity = metricsService.findOne(MetricsId.builder().userId(userEntity.getId()).build());
                MetricsDto metricsDto = metricsMapper.mapTo(metricsEntity);
                return ResponseEntity.ok(metricsDto);
            }
            catch (NoSuchElementException ex){
                // if not found, create one for today and return it
                MetricsEntity metricsEntity = metricsService.save(MetricsEntity.builder()
                        .id(MetricsId.builder().userId(userEntity.getId()).build())
                        .user(userEntity)
                        .goalCalories(userEntity.getGoalCalories())
                        .goalCarbohydrates(userEntity.getGoalCarbohydrates())
                        .goalCholesterol(userEntity.getGoalCholesterol())
                        .goalProtein(userEntity.getGoalProtein())
                        .goalSodium(userEntity.getGoalSodium())
                        .goalFat(userEntity.getGoalFat())
                        .goalFiber(userEntity.getGoalFiber())
                        .goalSugar(userEntity.getGoalSugar())
                        .goalPotassium(userEntity.getGoalPotassium())
                        .goalSaturatedFat(userEntity.getGoalSaturatedFat())
                        .goalTransFat(userEntity.getGoalTransFat())
                        .goalPolyunsaturatedFat(userEntity.getGoalPolyunsaturatedFat())
                        .goalMonounsaturatedFat(userEntity.getGoalMonounsaturatedFat())
                        .goalCholesterol(userEntity.getGoalCholesterol())
                        .build());
               MetricsDto metricsDto = metricsMapper.mapTo(metricsEntity);
               return ResponseEntity.ok(metricsDto);
            }
        }
        return null;
    }

    @PostMapping("/date")
    public ResponseEntity<MetricsDto> getMetricByDate(@RequestHeader("Authorization") String jwtToken, @RequestBody MetricRequestDto metricRequestDto) {
        UserDetails userDetails = authenticationService.validateToken(jwtToken.substring(7));
        UserEntity userEntity = userService.findByEmail(userDetails.getUsername());
        try{
            MetricsEntity metricsEntity = metricsService.findOne(MetricsId.builder().date(metricRequestDto.getDate()).userId(userEntity.getId()).build());
            MetricsDto metricsDto = metricsMapper.mapTo(metricsEntity);
            return ResponseEntity.ok(metricsDto);
        }catch(NoSuchElementException exception) {
            return ResponseEntity.ok(null);
        }
    }
}

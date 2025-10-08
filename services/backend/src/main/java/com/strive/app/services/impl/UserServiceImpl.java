package com.strive.app.services.impl;

import com.strive.app.domain.entities.FoodEntity;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.repositories.FoodRepository;
import com.strive.app.repositories.UserRepository;
import com.strive.app.services.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final FoodRepository foodRepository;

    @Override
    public boolean isExists(UUID id) {
        return userRepository.existsById(id);
    }

    @Override
    public UserEntity save(UserEntity userEntity){
        return userRepository.save(userEntity);
    }

    @Override
    public UserEntity save(String email, UserEntity userEntity) {
        return userRepository.findByEmail(email).map(existingUser -> {
            Optional.ofNullable(userEntity.getEmail()).ifPresent(existingUser::setEmail);
            Optional.ofNullable(userEntity.getName()).ifPresent(existingUser::setName);

            return userRepository.save(existingUser);
        }).orElseThrow();
    }

    @Override
    @Transactional
    public void addToRecentFoods(FoodEntity food, UserEntity userEntity) {
        FoodEntity existingFood = foodRepository.findByFoodNameAndFoodBrandNameAndInUserRecents_Id(food.getFoodName(), food.getFoodBrandName(), userEntity.getId());
        if (existingFood == null) {
            food.setInUserRecents(userEntity);
            userEntity.getRecentFoods().addFirst(food);
            userRepository.save(userEntity);
        }
    }

    @Override
    public UserEntity save(UUID id, UserEntity userEntity) {
        return userRepository.findById(id).map(existingUser -> {
            Optional.ofNullable(userEntity.getEmail()).ifPresent(existingUser::setEmail);
            Optional.ofNullable(userEntity.getName()).ifPresent(existingUser::setName);

            return userRepository.save(existingUser);
        }).orElseThrow();
    }

    @Override
    public void delete(UUID id){
        userRepository.deleteById(id);
    }

    @Override
    public Optional<UserEntity> findOne(UUID id){
        return userRepository.findById(id);
    }

    @Override
    public UserEntity findByEmail(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException(email));
    }
}

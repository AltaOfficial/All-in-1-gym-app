package com.strive.app.mappers.impl;

import com.strive.app.domain.dto.UserDto;
import com.strive.app.domain.entities.UserEntity;
import com.strive.app.mappers.Mapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapperImpl implements Mapper<UserEntity, UserDto> {

    private final ModelMapper modelMapper;

    @Override
    public UserDto mapTo(UserEntity userEntity){
        return modelMapper.map(userEntity, UserDto.class);
    }

    @Override
    public UserEntity mapFrom(UserDto userDto){
        return modelMapper.map(userDto, UserEntity.class);
    }
}

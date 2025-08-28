package com.strive.app.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.strive.app.domain.entities.FoodEntity;

import java.io.IOException;
import java.util.List;

public interface FoodsService {
    List<FoodEntity> search(String query) throws IOException, InterruptedException;
}

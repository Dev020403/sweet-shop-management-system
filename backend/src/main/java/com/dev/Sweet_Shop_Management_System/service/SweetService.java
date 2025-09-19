package com.dev.Sweet_Shop_Management_System.service;

import com.dev.Sweet_Shop_Management_System.dto.request.SweetCreateRequest;
import com.dev.Sweet_Shop_Management_System.dto.response.SweetResponse;
import com.dev.Sweet_Shop_Management_System.entity.Sweet;
import com.dev.Sweet_Shop_Management_System.repository.SweetRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class SweetService {

    private final SweetRepository sweetRepository;

    public SweetResponse addSweet(SweetCreateRequest request) {
        Sweet sweet = Sweet.builder()
                .name(request.getName())
                .category(request.getCategory())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .build();

        Sweet saved = sweetRepository.save(sweet);

        return SweetResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .category(saved.getCategory())
                .price(saved.getPrice())
                .quantity(saved.getQuantity())
                .build();
    }

    public List<SweetResponse> getAllSweets() {
        return sweetRepository.findAll()
                .stream()
                .map(sweet -> SweetResponse.builder()
                        .id(sweet.getId())
                        .name(sweet.getName())
                        .category(sweet.getCategory())
                        .price(sweet.getPrice())
                        .quantity(sweet.getQuantity())
                        .build())
                .collect(Collectors.toList());
    }
}

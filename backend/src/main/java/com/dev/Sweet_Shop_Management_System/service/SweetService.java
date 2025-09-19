package com.dev.Sweet_Shop_Management_System.service;

import com.dev.Sweet_Shop_Management_System.dto.request.SweetCreateRequest;
import com.dev.Sweet_Shop_Management_System.dto.response.SweetResponse;
import com.dev.Sweet_Shop_Management_System.entity.Sweet;
import com.dev.Sweet_Shop_Management_System.repository.SweetRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

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
}

package com.dev.Sweet_Shop_Management_System.service;

import com.dev.Sweet_Shop_Management_System.dto.request.SweetCreateRequest;
import com.dev.Sweet_Shop_Management_System.dto.response.SweetResponse;
import com.dev.Sweet_Shop_Management_System.entity.Sweet;
import com.dev.Sweet_Shop_Management_System.repository.SweetRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
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

    public List<SweetResponse> searchSweets(String name, String category, Double minPrice, Double maxPrice) {
        Specification<Sweet> spec = null;

        if (name != null && !name.isBlank()) {
            Specification<Sweet> nameSpec = (root, query, cb) ->
                    cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
            spec = (spec == null) ? nameSpec : spec.and(nameSpec);
        }

        if (category != null && !category.isBlank()) {
            Specification<Sweet> categorySpec = (root, query, cb) ->
                    cb.like(cb.lower(root.get("category")), "%" + category.toLowerCase() + "%");
            spec = (spec == null) ? categorySpec : spec.and(categorySpec);
        }

        if (minPrice != null) {
            Specification<Sweet> minPriceSpec = (root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("price"), minPrice);
            spec = (spec == null) ? minPriceSpec : spec.and(minPriceSpec);
        }

        if (maxPrice != null) {
            Specification<Sweet> maxPriceSpec = (root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("price"), maxPrice);
            spec = (spec == null) ? maxPriceSpec : spec.and(maxPriceSpec);
        }

        List<Sweet> sweets = (spec == null) ? sweetRepository.findAll() : sweetRepository.findAll(spec);

        return sweets.stream()
                .map(s -> SweetResponse.builder()
                        .id(s.getId())
                        .name(s.getName())
                        .category(s.getCategory())
                        .price(s.getPrice())
                        .quantity(s.getQuantity())
                        .build())
                .collect(Collectors.toList());
    }
}

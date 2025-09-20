package com.dev.Sweet_Shop_Management_System.service;

import com.dev.Sweet_Shop_Management_System.dto.request.PurchaseRequest;
import com.dev.Sweet_Shop_Management_System.dto.request.SweetCreateRequest;
import com.dev.Sweet_Shop_Management_System.dto.request.SweetUpdateRequest;
import com.dev.Sweet_Shop_Management_System.dto.response.SweetResponse;
import com.dev.Sweet_Shop_Management_System.entity.Sweet;
import com.dev.Sweet_Shop_Management_System.repository.SweetRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

    public SweetResponse updateSweet(Long id, SweetUpdateRequest request) {
        Sweet sweet = sweetRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sweet not found"));

        if (request.getName() != null) {
            if (request.getName().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name cannot be blank");
            }
            sweet.setName(request.getName());
        }

        if (request.getCategory() != null) {
            if (request.getCategory().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category cannot be blank");
            }
            sweet.setCategory(request.getCategory());
        }

        if (request.getPrice() != null) {
            if (request.getPrice() < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Price cannot be negative");
            }
            sweet.setPrice(request.getPrice());
        }

        if (request.getQuantity() != null) {
            if (request.getQuantity() < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity cannot be negative");
            }
            sweet.setQuantity(request.getQuantity());
        }

        Sweet updated = sweetRepository.save(sweet);

        return SweetResponse.builder()
                .id(updated.getId())
                .name(updated.getName())
                .category(updated.getCategory())
                .price(updated.getPrice())
                .quantity(updated.getQuantity())
                .build();
    }

    public void deleteSweet(Long id) {
        if (!sweetRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sweet not found with id " + id);
        }
        sweetRepository.deleteById(id);
    }

    public SweetResponse purchaseSweet(Long id, PurchaseRequest request) {
        Sweet sweet = sweetRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sweet not found"));

        int quantity = request.getQuantity();

        if (quantity <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be greater than 0");
        }

        if (sweet.getQuantity() < quantity) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock available");
        }

        sweet.setQuantity(sweet.getQuantity() - quantity);
        Sweet updated = sweetRepository.save(sweet);

        return SweetResponse.builder()
                .id(updated.getId())
                .name(updated.getName())
                .category(updated.getCategory())
                .price(updated.getPrice())
                .quantity(updated.getQuantity())
                .build();
    }

    public SweetResponse restockSweet(Long id, int quantity) {
        Sweet sweet = sweetRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sweet not found"));

        if (quantity <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Restock quantity must be greater than 0");
        }

        sweet.setQuantity(sweet.getQuantity() + quantity);
        Sweet updated = sweetRepository.save(sweet);

        return SweetResponse.builder()
                .id(updated.getId())
                .name(updated.getName())
                .category(updated.getCategory())
                .price(updated.getPrice())
                .quantity(updated.getQuantity())
                .build();
    }

}

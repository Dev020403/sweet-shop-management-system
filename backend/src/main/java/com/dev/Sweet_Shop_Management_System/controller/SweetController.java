package com.dev.Sweet_Shop_Management_System.controller;

import com.dev.Sweet_Shop_Management_System.dto.request.PurchaseRequest;
import com.dev.Sweet_Shop_Management_System.dto.request.RestockRequest;
import com.dev.Sweet_Shop_Management_System.dto.request.SweetCreateRequest;
import com.dev.Sweet_Shop_Management_System.dto.request.SweetUpdateRequest;
import com.dev.Sweet_Shop_Management_System.dto.response.SweetResponse;
import com.dev.Sweet_Shop_Management_System.service.SweetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sweets")
@RequiredArgsConstructor
public class SweetController {

    private final SweetService sweetService;

    @PostMapping
    public ResponseEntity<SweetResponse> addSweet(@Valid @RequestBody SweetCreateRequest request) {
        SweetResponse response = sweetService.addSweet(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<SweetResponse>> getAllSweets() {
        return ResponseEntity.ok(sweetService.getAllSweets());
    }

    @GetMapping("/search")
    public ResponseEntity<List<SweetResponse>> searchSweets(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        return ResponseEntity.ok(sweetService.searchSweets(name, category, minPrice, maxPrice));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SweetResponse> updateSweet(
            @PathVariable Long id,
            @Valid @RequestBody SweetUpdateRequest request) {
        return ResponseEntity.ok(sweetService.updateSweet(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteSweet(@PathVariable Long id) {
        sweetService.deleteSweet(id);
        return ResponseEntity.ok("Sweet deleted successfully");
    }

    @PostMapping("/{id}/purchase")
    public ResponseEntity<SweetResponse> purchaseSweet(
            @PathVariable Long id,
            @Valid @RequestBody PurchaseRequest request) {
        SweetResponse response = sweetService.purchaseSweet(id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/restock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SweetResponse> restockSweet(
            @PathVariable Long id,
            @RequestBody RestockRequest request) {
        SweetResponse response = sweetService.restockSweet(id, request.getQuantity());
        return ResponseEntity.ok(response);
    }

}

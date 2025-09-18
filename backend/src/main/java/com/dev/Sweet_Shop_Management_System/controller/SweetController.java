package com.dev.Sweet_Shop_Management_System.controller;

import com.dev.Sweet_Shop_Management_System.dto.request.SweetCreateRequest;
import com.dev.Sweet_Shop_Management_System.dto.response.SweetResponse;
import com.dev.Sweet_Shop_Management_System.service.SweetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sweets")
@RequiredArgsConstructor
public class SweetController {

    private final SweetService sweetService;

    @PostMapping
    public ResponseEntity<SweetResponse> addSweet(@Valid @RequestBody SweetCreateRequest request) {
        SweetResponse response = sweetService.addSweet(request);
        if (response == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

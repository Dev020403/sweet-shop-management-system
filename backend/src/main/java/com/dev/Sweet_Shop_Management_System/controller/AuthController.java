package com.dev.Sweet_Shop_Management_System.controller;

import com.dev.Sweet_Shop_Management_System.dto.request.RegisterRequest;
import com.dev.Sweet_Shop_Management_System.dto.response.RegisterResponse;
import com.dev.Sweet_Shop_Management_System.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerUser(@Valid @RequestBody RegisterRequest request) {
        RegisterResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

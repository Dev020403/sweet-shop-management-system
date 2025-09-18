package com.dev.Sweet_Shop_Management_System.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank
    private String username;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;
}

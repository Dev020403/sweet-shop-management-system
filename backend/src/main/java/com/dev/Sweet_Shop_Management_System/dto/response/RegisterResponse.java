package com.dev.Sweet_Shop_Management_System.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {
    private Long id;
    private String username;
    private String email;
}
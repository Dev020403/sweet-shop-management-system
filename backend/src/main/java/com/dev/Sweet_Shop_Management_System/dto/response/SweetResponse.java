package com.dev.Sweet_Shop_Management_System.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SweetResponse {
    private Long id;
    private String name;
    private String category;
    private Double price;
    private Integer quantity;
}


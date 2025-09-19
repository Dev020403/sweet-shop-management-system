package com.dev.Sweet_Shop_Management_System.dto.request;

import jakarta.validation.constraints.Min;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SweetUpdateRequest {
    private String name;
    private String category;

    @Min(value = 0, message = "Price must be non-negative")
    private Double price;

    @Min(value = 0, message = "Quantity must be non-negative")
    private Integer quantity;
}
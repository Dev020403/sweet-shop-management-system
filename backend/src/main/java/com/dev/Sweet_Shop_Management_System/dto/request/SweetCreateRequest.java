package com.dev.Sweet_Shop_Management_System.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SweetCreateRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String category;

    @NotNull
    @Min(value = 0, message = "Price must be non-negative")
    private Double price;

    @NotNull
    @Min(value = 0, message = "Quantity must be non-negative")
    private Integer quantity;
}

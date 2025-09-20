package com.dev.Sweet_Shop_Management_System.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseRequest {
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Purchase quantity must be at least 1")
    private Integer quantity;
}
package com.dev.Sweet_Shop_Management_System.dto.request;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestockRequest {
    @Min(value = 1, message = "Restock quantity must be greater than 0")
    private int quantity;
}

package com.dev.Sweet_Shop_Management_System.sweet;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class SweetCreationControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("✅ Should add a sweet successfully")
    void shouldAddSweetSuccessfully() throws Exception {
        var request = SweetRequest.builder()
                .name("Gulab Jamun")
                .category("Indian Sweet")
                .price(10.5)
                .quantity(50)
                .build();

        mockMvc.perform(post("/api/sweets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Gulab Jamun"))
                .andExpect(jsonPath("$.category").value("Indian Sweet"))
                .andExpect(jsonPath("$.price").value(10.5))
                .andExpect(jsonPath("$.quantity").value(50));
    }

    @Test
    @DisplayName("❌ Should fail when name is missing")
    void shouldFailWhenNameMissing() throws Exception {
        var request = SweetRequest.builder()
                .category("Indian Sweet")
                .price(10.5)
                .quantity(50)
                .build();

        mockMvc.perform(post("/api/sweets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("❌ Should fail when price is negative")
    void shouldFailWhenPriceNegative() throws Exception {
        var request = SweetRequest.builder()
                .name("Ladoo")
                .category("Indian Sweet")
                .price(-5.0)
                .quantity(20)
                .build();

        mockMvc.perform(post("/api/sweets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("❌ Should fail when quantity is negative")
    void shouldFailWhenQuantityNegative() throws Exception {
        var request = SweetRequest.builder()
                .name("Kaju Katli")
                .category("Indian Sweet")
                .price(15.0)
                .quantity(-10)
                .build();

        mockMvc.perform(post("/api/sweets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    static class SweetRequest {
        private String name;
        private String category;
        private Double price;
        private Integer quantity;
    }
}

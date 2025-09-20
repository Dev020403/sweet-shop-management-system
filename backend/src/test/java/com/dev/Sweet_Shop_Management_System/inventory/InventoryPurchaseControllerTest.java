package com.dev.Sweet_Shop_Management_System.inventory;

import com.dev.Sweet_Shop_Management_System.dto.request.RegisterRequest;
import com.dev.Sweet_Shop_Management_System.dto.request.LoginRequest;
import com.dev.Sweet_Shop_Management_System.dto.request.SweetCreateRequest;
import com.dev.Sweet_Shop_Management_System.dto.request.PurchaseRequest;
import com.dev.Sweet_Shop_Management_System.entity.Role;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.*;
import org.junit.jupiter.api.BeforeEach;
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
class SweetPurchaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String userToken;
    private Long sweetId;

    @BeforeEach
    void setup() throws Exception {
        // Register and login user
        var register = RegisterRequest.builder()
                .username("purchaseUser")
                .email("purchase@example.com")
                .password("password123")
                .role(Role.USER)
                .build();
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated());

        var login = LoginRequest.builder()
                .usernameOrEmail("purchaseUser")
                .password("password123")
                .build();
        var loginResponse = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andReturn();
        userToken = objectMapper.readTree(loginResponse.getResponse().getContentAsString()).get("token").asText();

        // Add a sweet
        var sweetRequest = SweetCreateRequest.builder()
                .name("Rasgulla")
                .category("Indian Sweet")
                .price(10.0)
                .quantity(5)
                .build();
        var sweetResponse = mockMvc.perform(post("/api/sweets")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sweetRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        sweetId = objectMapper.readTree(sweetResponse.getResponse().getContentAsString()).get("id").asLong();
    }

    @Test
    @DisplayName("✅ Should purchase sweet successfully")
    void shouldPurchaseSweetSuccessfully() throws Exception {
        var purchase = PurchaseRequest.builder().quantity(2).build();

        mockMvc.perform(post("/api/sweets/" + sweetId + "/purchase")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(purchase)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(3)); // 5 - 2 = 3
    }

    @Test
    @DisplayName("❌ Should fail when insufficient stock")
    void shouldFailWhenInsufficientStock() throws Exception {
        var purchase = PurchaseRequest.builder().quantity(10).build();

        mockMvc.perform(post("/api/sweets/" + sweetId + "/purchase")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(purchase)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Insufficient stock available"));
    }

    @Test
    @DisplayName("❌ Should fail when sweet not found")
    void shouldFailWhenSweetNotFound() throws Exception {
        var purchase = PurchaseRequest.builder().quantity(1).build();

        mockMvc.perform(post("/api/sweets/99999/purchase")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(purchase)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("❌ Should fail when not authenticated")
    void shouldFailWithoutAuth() throws Exception {
        var purchase = PurchaseRequest.builder().quantity(1).build();

        mockMvc.perform(post("/api/sweets/" + sweetId + "/purchase")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(purchase)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("❌ Should fail when invalid JWT provided")
    void shouldFailWithInvalidJwt() throws Exception {
        var purchase = PurchaseRequest.builder().quantity(1).build();

        mockMvc.perform(post("/api/sweets/" + sweetId + "/purchase")
                        .header("Authorization", "Bearer invalid.token.here")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(purchase)))
                .andExpect(status().isUnauthorized());
    }

}

package com.dev.Sweet_Shop_Management_System.sweet;

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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class SweetUpdateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String jwtToken;
    private Long sweetId;

    @BeforeEach
    void setup() throws Exception {
        var registerRequest = RegisterRequest.builder()
                .username("updateUser")
                .email("updateuser@example.com")
                .password("password123")
                .role(Role.USER)
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        var loginRequest = LoginRequest.builder()
                .usernameOrEmail("updateUser")
                .password("password123")
                .build();

        var response = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        jwtToken = objectMapper.readTree(response.getResponse().getContentAsString()).get("token").asText();

        var sweetRequest = SweetRequest.builder()
                .name("Kalakand")
                .category("Indian Sweet")
                .price(30.0)
                .quantity(10)
                .build();

        var sweetResponse = mockMvc.perform(post("/api/sweets")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sweetRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        sweetId = objectMapper.readTree(sweetResponse.getResponse().getContentAsString()).get("id").asLong();
    }

    @Test
    @DisplayName("✅ Should update sweet successfully")
    void shouldUpdateSweetSuccessfully() throws Exception {
        var updateRequest = SweetRequest.builder()
                .name("Kalakand Special")
                .category("Indian Sweet")
                .price(35.0)
                .quantity(15)
                .build();

        mockMvc.perform(put("/api/sweets/" + sweetId)
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(sweetId))
                .andExpect(jsonPath("$.name").value("Kalakand Special"))
                .andExpect(jsonPath("$.price").value(35.0))
                .andExpect(jsonPath("$.quantity").value(15));
    }

    @Test
    @DisplayName("❌ Should return 404 when sweet not found")
    void shouldFailWhenSweetNotFound() throws Exception {
        var updateRequest = SweetRequest.builder()
                .name("NonExisting")
                .category("Test")
                .price(50.0)
                .quantity(5)
                .build();

        mockMvc.perform(put("/api/sweets/999999")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("❌ Should fail when price is negative")
    void shouldFailWhenPriceNegative() throws Exception {
        var updateRequest = SweetRequest.builder()
                .name("Bad Sweet")
                .category("Test")
                .price(-10.0)
                .quantity(5)
                .build();

        mockMvc.perform(put("/api/sweets/" + sweetId)
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("❌ Should fail when quantity is negative")
    void shouldFailWhenQuantityNegative() throws Exception {
        var updateRequest = SweetRequest.builder()
                .name("Bad Sweet")
                .category("Test")
                .price(20.0)
                .quantity(-5)
                .build();

        mockMvc.perform(put("/api/sweets/" + sweetId)
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("❌ Should fail when name is blank")
    void shouldFailWhenNameBlank() throws Exception {
        var updateRequest = SweetRequest.builder()
                .name("   ") // blank
                .category("Indian Sweet")
                .price(25.0)
                .quantity(5)
                .build();

        mockMvc.perform(put("/api/sweets/" + sweetId)
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("❌ Should fail when unauthorized")
    void shouldFailWhenUnauthorized() throws Exception {
        var updateRequest = SweetRequest.builder()
                .name("Unauthorized Update")
                .category("Test")
                .price(40.0)
                .quantity(10)
                .build();

        mockMvc.perform(put("/api/sweets/" + sweetId) // no Authorization header
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("❌ Should fail when token is invalid")
    void shouldFailWhenInvalidToken() throws Exception {
        var updateRequest = SweetRequest.builder()
                .name("Invalid Token Update")
                .category("Test")
                .price(40.0)
                .quantity(10)
                .build();

        mockMvc.perform(put("/api/sweets/" + sweetId)
                        .header("Authorization", "Bearer invalidtoken123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("✅ Should allow updating only some fields")
    void shouldAllowPartialUpdate() throws Exception {
        var updateRequest = SweetRequest.builder()
                .name("Only Name Updated")
                .build();

        mockMvc.perform(put("/api/sweets/" + sweetId)
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(sweetId))
                .andExpect(jsonPath("$.name").value("Only Name Updated"))
                .andExpect(jsonPath("$.category").value("Indian Sweet"))
                .andExpect(jsonPath("$.price").value(30.0))
                .andExpect(jsonPath("$.quantity").value(10));
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

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private Role role;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    static class LoginRequest {
        private String usernameOrEmail;
        private String password;
    }
}

package com.dev.Sweet_Shop_Management_System.sweet;

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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class SweetListControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String jwtToken;

    @BeforeEach
    void setup() throws Exception {
        var registerRequest = SweetCreationControllerTest.RegisterRequest.builder()
                .username("sweetUser")
                .email("sweetuser@example.com")
                .password("password123")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        var loginRequest = SweetCreationControllerTest.LoginRequest.builder()
                .usernameOrEmail("sweetUser")
                .password("password123")
                .build();

        var response = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = response.getResponse().getContentAsString();
        jwtToken = objectMapper.readTree(responseBody).get("token").asText();

        var sweetRequest = SweetRequest.builder()
                .name("Rasgulla")
                .category("Indian Sweet")
                .price(20.0)
                .quantity(30)
                .build();

        mockMvc.perform(post("/api/sweets")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sweetRequest)))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("✅ Should fetch all sweets with JWT")
    void shouldFetchAllSweets() throws Exception {
        mockMvc.perform(get("/api/sweets")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Rasgulla"));
    }

    @Test
    @DisplayName("❌ Should fail without JWT")
    void shouldFailWithoutJwt() throws Exception {
        mockMvc.perform(get("/api/sweets"))
                .andExpect(status().isUnauthorized());
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

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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class SweetDeleteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;
    private String userToken;
    private Long sweetId;

    @BeforeEach
    void setup() throws Exception {
        var adminRegister = RegisterRequest.builder()
                .username("adminUser")
                .email("admin@example.com")
                .password("password123")
                .role(Role.ADMIN)
                .build();
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adminRegister)))
                .andExpect(status().isCreated());

        var adminLogin = LoginRequest.builder()
                .usernameOrEmail("adminUser")
                .password("password123")
                .build();
        var adminResponse = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adminLogin)))
                .andReturn();
        adminToken = objectMapper.readTree(adminResponse.getResponse().getContentAsString()).get("token").asText();

        var userRegister = RegisterRequest.builder()
                .username("normalUser")
                .email("user@example.com")
                .password("password123")
                .role(Role.USER)
                .build();
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userRegister)))
                .andExpect(status().isCreated());

        var userLogin = LoginRequest.builder()
                .usernameOrEmail("normalUser")
                .password("password123")
                .build();
        var userResponse = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userLogin)))
                .andReturn();
        userToken = objectMapper.readTree(userResponse.getResponse().getContentAsString()).get("token").asText();

        var sweetRequest = SweetRequest.builder()
                .name("Rasgulla")
                .category("Indian Sweet")
                .price(20.0)
                .quantity(10)
                .build();

        var sweetResponse = mockMvc.perform(post("/api/sweets")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sweetRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        sweetId = objectMapper.readTree(sweetResponse.getResponse().getContentAsString()).get("id").asLong();
    }

    @Test
    @DisplayName("✅ Should delete sweet successfully as admin")
    void shouldDeleteSweetAsAdmin() throws Exception {
        mockMvc.perform(delete("/api/sweets/" + sweetId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/sweets/" + sweetId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("❌ Should return 404 when sweet not found")
    void shouldReturn404WhenNotFound() throws Exception {
        mockMvc.perform(delete("/api/sweets/999999")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("❌ Should fail when not authenticated")
    void shouldFailWithoutAuth() throws Exception {
        mockMvc.perform(delete("/api/sweets/" + sweetId))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("❌ Should fail when user is not admin")
    void shouldFailForNonAdminUser() throws Exception {
        mockMvc.perform(delete("/api/sweets/" + sweetId)
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
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

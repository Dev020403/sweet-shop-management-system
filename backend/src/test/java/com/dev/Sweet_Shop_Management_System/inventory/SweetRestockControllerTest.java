package com.dev.Sweet_Shop_Management_System.inventory;

import com.dev.Sweet_Shop_Management_System.dto.request.RegisterRequest;
import com.dev.Sweet_Shop_Management_System.dto.request.LoginRequest;
import com.dev.Sweet_Shop_Management_System.dto.request.RestockRequest;
import com.dev.Sweet_Shop_Management_System.dto.request.SweetCreateRequest;
import com.dev.Sweet_Shop_Management_System.entity.Role;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
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
class SweetRestockControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;
    private String userToken;
    private Long sweetId;

    @BeforeEach
    void setup() throws Exception {
        // Register and login admin
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
        var adminLoginResponse = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adminLogin)))
                .andReturn();
        adminToken = objectMapper.readTree(adminLoginResponse.getResponse().getContentAsString()).get("token").asText();

        // Register and login regular user
        var userRegister = RegisterRequest.builder()
                .username("regularUser")
                .email("user@example.com")
                .password("password123")
                .role(Role.USER)
                .build();
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userRegister)))
                .andExpect(status().isCreated());

        var userLogin = LoginRequest.builder()
                .usernameOrEmail("regularUser")
                .password("password123")
                .build();
        var userLoginResponse = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userLogin)))
                .andReturn();
        userToken = objectMapper.readTree(userLoginResponse.getResponse().getContentAsString()).get("token").asText();

        // Add a sweet
        var sweetRequest = SweetCreateRequest.builder()
                .name("Gulab Jamun")
                .category("Indian Sweet")
                .price(15.0)
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
    @DisplayName("✅ Should restock sweet successfully as admin")
    void shouldRestockSweetSuccessfullyAsAdmin() throws Exception {
        var restock = RestockRequest.builder().quantity(25).build();

        mockMvc.perform(post("/api/sweets/" + sweetId + "/restock")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(restock)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(35)) // 10 + 25 = 35
                .andExpect(jsonPath("$.name").value("Gulab Jamun"));
    }

    @Test
    @DisplayName("❌ Should fail when regular user tries to restock")
    void shouldFailWhenRegularUserTriesToRestock() throws Exception {
        var restock = RestockRequest.builder().quantity(25).build();

        mockMvc.perform(post("/api/sweets/" + sweetId + "/restock")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(restock)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("❌ Should fail when not authenticated")
    void shouldFailWhenNotAuthenticated() throws Exception {
        var restock = RestockRequest.builder().quantity(25).build();

        mockMvc.perform(post("/api/sweets/" + sweetId + "/restock")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(restock)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("❌ Should fail when sweet not found")
    void shouldFailWhenSweetNotFound() throws Exception {
        var restock = RestockRequest.builder().quantity(25).build();

        mockMvc.perform(post("/api/sweets/99999/restock")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(restock)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Sweet not found"));
    }

    @Test
    @DisplayName("❌ Should fail when restock quantity is zero or negative")
    void shouldFailWhenRestockQuantityIsInvalid() throws Exception {
        var zeroRestock = RestockRequest.builder().quantity(0).build();

        mockMvc.perform(post("/api/sweets/" + sweetId + "/restock")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(zeroRestock)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Restock quantity must be greater than 0"));

        var negativeRestock = RestockRequest.builder().quantity(-5).build();

        mockMvc.perform(post("/api/sweets/" + sweetId + "/restock")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(negativeRestock)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Restock quantity must be greater than 0"));
    }

    @Test
    @DisplayName("❌ Should fail when invalid JWT provided")
    void shouldFailWithInvalidJwt() throws Exception {
        var restock = RestockRequest.builder().quantity(25).build();

        mockMvc.perform(post("/api/sweets/" + sweetId + "/restock")
                        .header("Authorization", "Bearer invalid.token.here")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(restock)))
                .andExpect(status().isUnauthorized());
    }
}

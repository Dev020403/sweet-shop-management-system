package com.dev.Sweet_Shop_Management_System.sweet;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SweetSearchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String jwtToken;

    @BeforeEach
    void setup() throws Exception {
        var registerRequest = RegisterRequest.builder()
                .username("searchUser")
                .email("searchuser@example.com")
                .password("password123")
                .build();
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        var loginRequest = LoginRequest.builder()
                .usernameOrEmail("searchUser")
                .password("password123")
                .build();
        var response = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();
        jwtToken = objectMapper.readTree(response.getResponse().getContentAsString()).get("token").asText();

        mockMvc.perform(post("/api/sweets")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new SweetRequest("Gulab Jamun", "Indian", 15.0, 20))))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/sweets")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new SweetRequest("Chocolate Barfi", "Indian", 25.0, 15))))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/sweets")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new SweetRequest("Baklava", "Middle Eastern", 40.0, 10))))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("✅ Should search sweets by name")
    void shouldSearchByName() throws Exception {
        mockMvc.perform(get("/api/sweets/search?name=Gulab")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Gulab Jamun"));
    }

    @Test
    @DisplayName("✅ Should search sweets by category")
    void shouldSearchByCategory() throws Exception {
        mockMvc.perform(get("/api/sweets/search?category=Indian")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @DisplayName("✅ Should search sweets by price range")
    void shouldSearchByPriceRange() throws Exception {
        mockMvc.perform(get("/api/sweets/search?minPrice=20&maxPrice=50")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @DisplayName("✅ Should return all sweets if no filters are provided")
    void shouldReturnAllWhenNoParams() throws Exception {
        mockMvc.perform(get("/api/sweets/search")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    @DisplayName("❌ Should return empty list when no sweets match")
    void shouldReturnEmptyWhenNoMatch() throws Exception {
        mockMvc.perform(get("/api/sweets/search?name=NonExistent")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }


    @Test
    @DisplayName("✅ Should search sweets by category and price range together")
    void shouldSearchByCategoryAndPriceRange() throws Exception {
        mockMvc.perform(get("/api/sweets/search?category=Indian&minPrice=10&maxPrice=30")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @DisplayName("❌ Should fail without JWT")
    void shouldFailWithoutJwt() throws Exception {
        mockMvc.perform(get("/api/sweets/search?name=Gulab"))
                .andExpect(status().isUnauthorized());
    }

    @Data
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

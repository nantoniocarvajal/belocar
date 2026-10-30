package cl.belocar.backend.web;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityIntegrationTest {

    // Cada test usa su propia IP simulada (X-Forwarded-For) para no compartir el
    // contador de intentos fallidos de LoginAttemptService entre tests.

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void publicEndpointsAreAccessibleWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/categories")).andExpect(status().isOk());
        mockMvc.perform(get("/api/products")).andExpect(status().isOk());
    }

    @Test
    void healthEndpointIsAccessibleWithoutAuth() throws Exception {
        mockMvc.perform(get("/actuator/health")).andExpect(status().isOk());
    }

    @Test
    void adminEndpointsRejectRequestsWithoutToken() throws Exception {
        mockMvc.perform(get("/api/admin/products")).andExpect(status().isForbidden());
    }

    @Test
    void loginWithWrongPasswordIsRejected() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of("username", "admin", "password", "incorrecta"));

        mockMvc.perform(post("/api/admin/auth/login")
                        .header("X-Forwarded-For", "10.0.0.1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void loginGrantsAccessToProtectedEndpoints() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of("username", "admin", "password", "test-password-123"));

        MvcResult loginResult = mockMvc.perform(post("/api/admin/auth/login")
                        .header("X-Forwarded-For", "10.0.0.2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andReturn();

        String responseJson = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseJson).get("token").asText();

        mockMvc.perform(get("/api/admin/products").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void repeatedFailedLoginsAreRateLimited() throws Exception {
        String wrongBody = objectMapper.writeValueAsString(Map.of("username", "admin", "password", "incorrecta"));

        for (int i = 0; i < 5; i++) {
            mockMvc.perform(post("/api/admin/auth/login")
                            .header("X-Forwarded-For", "10.0.0.3")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(wrongBody))
                    .andExpect(status().isUnauthorized());
        }

        // El sexto intento ya deberia estar bloqueado, incluso con la contrasena correcta:
        // el bloqueo es por IP, no depende de si la credencial es valida.
        String correctBody =
                objectMapper.writeValueAsString(Map.of("username", "admin", "password", "test-password-123"));
        mockMvc.perform(post("/api/admin/auth/login")
                        .header("X-Forwarded-For", "10.0.0.3")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(correctBody))
                .andExpect(status().isTooManyRequests());
    }
}

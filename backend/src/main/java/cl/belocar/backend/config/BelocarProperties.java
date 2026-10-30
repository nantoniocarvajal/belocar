package cl.belocar.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "belocar")
public record BelocarProperties(Jwt jwt, Cors cors, Storage storage, Whatsapp whatsapp, Admin admin) {

    public record Jwt(String secret, long expirationMinutes) {
    }

    public record Cors(String allowedOrigins) {
    }

    public record Storage(String localDir, String publicBaseUrl) {
    }

    public record Whatsapp(String defaultNumber) {
    }

    public record Admin(String defaultUsername, String defaultPassword) {
    }
}

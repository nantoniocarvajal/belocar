package cl.belocar.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record SiteConfigRequest(
        @NotBlank(message = "El número de WhatsApp es obligatorio")
        @Pattern(regexp = "^[0-9]{8,15}$", message = "El número de WhatsApp debe tener solo dígitos, con código de país (ej: 56912345678)")
        String whatsappNumber,

        String contactEmail,

        String contactPhone,

        String contactAddress,

        String dispatchInfo,

        String pickupInfo
) {
}

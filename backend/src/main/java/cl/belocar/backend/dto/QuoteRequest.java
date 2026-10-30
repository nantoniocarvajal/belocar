package cl.belocar.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import java.util.List;

public record QuoteRequest(
        @NotBlank(message = "El nombre del cliente es obligatorio")
        String customerName,

        @NotBlank(message = "El tipo de cliente es obligatorio")
        @Pattern(regexp = "empresa|particular", message = "Tipo de cliente invalido")
        String clientType,

        String companyName,

        @NotBlank(message = "El telefono es obligatorio")
        String phone,

        String email,

        @NotBlank(message = "La comuna es obligatoria")
        String commune,

        @NotBlank(message = "La modalidad es obligatoria")
        @Pattern(regexp = "despacho|retiro", message = "Modalidad invalida")
        String fulfillmentMode,

        String notes,

        @NotEmpty(message = "La cotizacion debe tener al menos un producto")
        @Valid
        List<QuoteItemRequest> items
) {
}

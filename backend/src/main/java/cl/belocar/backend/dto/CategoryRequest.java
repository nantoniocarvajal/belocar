package cl.belocar.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank(message = "El nombre de la categoría es obligatorio")
        @Size(max = 120, message = "El nombre no puede superar 120 caracteres")
        String name
) {
}

package cl.belocar.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ProductRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 180, message = "El nombre no puede superar 180 caracteres")
        String name,

        @NotBlank(message = "La marca o viña es obligatoria")
        @Size(max = 120)
        String brand,

        @NotNull(message = "La categoría es obligatoria")
        Long categoryId,

        @Size(max = 120)
        String varietal,

        @NotBlank(message = "La descripción breve es obligatoria")
        @Size(max = 300, message = "La descripción breve no puede superar 300 caracteres")
        String shortDescription,

        @NotBlank(message = "La descripción completa es obligatoria")
        String fullDescription,

        @NotBlank(message = "El formato es obligatorio")
        @Size(max = 80)
        String format,

        @NotNull(message = "Las unidades por caja son obligatorias")
        @Min(value = 1, message = "Las unidades por caja deben ser al menos 1")
        Integer unitsPerBox,

        @NotBlank(message = "La imagen principal es obligatoria")
        String mainImageUrl,

        List<String> additionalImageUrls,

        boolean featured,

        boolean published,

        Integer displayOrder,

        String internalNotes
) {
}

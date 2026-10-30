package cl.belocar.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record QuoteItemRequest(
        Long productId,

        @NotBlank(message = "El nombre del producto es obligatorio")
        String name,

        @NotBlank(message = "La marca del producto es obligatoria")
        String brand,

        @NotBlank(message = "El formato del producto es obligatorio")
        String format,

        @NotNull(message = "Las unidades por caja son obligatorias")
        @Min(1)
        Integer unitsPerBox,

        @NotNull(message = "La cantidad de cajas es obligatoria")
        @Min(1)
        Integer boxes
) {
}

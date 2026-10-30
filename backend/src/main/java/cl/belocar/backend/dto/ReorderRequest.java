package cl.belocar.backend.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/** Lista de IDs de producto en el nuevo orden deseado (de arriba hacia abajo). */
public record ReorderRequest(@NotEmpty List<Long> orderedProductIds) {
}

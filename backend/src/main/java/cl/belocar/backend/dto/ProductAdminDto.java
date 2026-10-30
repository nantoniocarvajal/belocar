package cl.belocar.backend.dto;

import java.time.Instant;
import java.util.List;

public record ProductAdminDto(
        Long id,
        String name,
        String slug,
        String brand,
        Long categoryId,
        String categoryName,
        String varietal,
        String shortDescription,
        String fullDescription,
        String format,
        Integer unitsPerBox,
        String mainImageUrl,
        List<String> additionalImageUrls,
        boolean featured,
        boolean published,
        Integer displayOrder,
        String internalNotes,
        Instant createdAt,
        Instant updatedAt
) {
}

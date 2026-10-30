package cl.belocar.backend.dto;

import java.util.List;

public record ProductDetailDto(
        Long id,
        String name,
        String slug,
        String brand,
        String categoryName,
        String categorySlug,
        String varietal,
        String shortDescription,
        String fullDescription,
        String format,
        Integer unitsPerBox,
        String mainImageUrl,
        List<String> additionalImageUrls,
        boolean featured
) {
}

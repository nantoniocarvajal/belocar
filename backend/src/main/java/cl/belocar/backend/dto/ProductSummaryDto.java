package cl.belocar.backend.dto;

public record ProductSummaryDto(
        Long id,
        String name,
        String slug,
        String brand,
        String categoryName,
        String categorySlug,
        String format,
        Integer unitsPerBox,
        String mainImageUrl,
        String shortDescription,
        boolean featured
) {
}

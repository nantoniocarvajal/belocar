package cl.belocar.backend.dto;

public record QuoteItemDto(
        Long productId,
        String productName,
        String productBrand,
        String format,
        Integer unitsPerBox,
        Integer boxes
) {
}

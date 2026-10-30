package cl.belocar.backend.dto;

import java.time.Instant;
import java.util.List;

public record QuoteDetailDto(
        Long id,
        String customerName,
        String clientType,
        String companyName,
        String phone,
        String email,
        String commune,
        String fulfillmentMode,
        String notes,
        Integer totalBoxes,
        List<QuoteItemDto> items,
        Instant createdAt
) {
}

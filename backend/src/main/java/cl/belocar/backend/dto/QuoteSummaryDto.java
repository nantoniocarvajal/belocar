package cl.belocar.backend.dto;

import java.time.Instant;

public record QuoteSummaryDto(
        Long id,
        String customerName,
        String clientType,
        String phone,
        String commune,
        String fulfillmentMode,
        Integer totalBoxes,
        Integer itemCount,
        Instant createdAt
) {
}

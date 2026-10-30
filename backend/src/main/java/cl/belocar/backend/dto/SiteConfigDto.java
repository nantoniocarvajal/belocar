package cl.belocar.backend.dto;

public record SiteConfigDto(
        String whatsappNumber,
        String contactEmail,
        String contactPhone,
        String contactAddress,
        String dispatchInfo,
        String pickupInfo
) {
}

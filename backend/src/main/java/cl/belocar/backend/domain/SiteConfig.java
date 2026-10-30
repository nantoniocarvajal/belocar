package cl.belocar.backend.domain;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Fila única (id = 1) con la configuración editable desde el panel de administración:
 * número de WhatsApp, datos de contacto y textos de despacho/retiro.
 */
@Entity
@Table(name = "site_config")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteConfig {

    @Id
    private Long id;

    @Column(name = "whatsapp_number", nullable = false, length = 20)
    private String whatsappNumber;

    @Column(name = "contact_email", length = 150)
    private String contactEmail;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(name = "contact_address", length = 250)
    private String contactAddress;

    @Column(name = "dispatch_info", columnDefinition = "TEXT")
    private String dispatchInfo;

    @Column(name = "pickup_info", columnDefinition = "TEXT")
    private String pickupInfo;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    void onSave() {
        updatedAt = Instant.now();
    }
}

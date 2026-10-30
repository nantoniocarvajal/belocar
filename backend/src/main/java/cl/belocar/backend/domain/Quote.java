package cl.belocar.backend.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Registro interno de una solicitud de cotizacion enviada por WhatsApp.
 * Se guarda para seguimiento comercial; el precio final se conversa siempre por WhatsApp.
 */
@Entity
@Table(name = "quotes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_name", nullable = false, length = 150)
    private String customerName;

    @Column(name = "client_type", nullable = false, length = 20)
    private String clientType;

    @Column(name = "company_name", length = 150)
    private String companyName;

    @Column(nullable = false, length = 30)
    private String phone;

    @Column(length = 150)
    private String email;

    @Column(nullable = false, length = 100)
    private String commune;

    @Column(name = "fulfillment_mode", nullable = false, length = 20)
    private String fulfillmentMode;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "total_boxes", nullable = false)
    private Integer totalBoxes;

    @Builder.Default
    @OneToMany(mappedBy = "quote", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuoteItem> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }
}

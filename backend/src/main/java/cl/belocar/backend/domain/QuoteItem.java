package cl.belocar.backend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Linea de una cotizacion. Guarda una "foto" del producto al momento de cotizar
 * (nombre, marca, formato) para que el historial no cambie si el producto se edita
 * o elimina despues. product_id queda solo como referencia informativa, sin llave foranea.
 */
@Entity
@Table(name = "quote_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuoteItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quote_id", nullable = false)
    private Quote quote;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "product_name", nullable = false, length = 180)
    private String productName;

    @Column(name = "product_brand", nullable = false, length = 120)
    private String productBrand;

    @Column(nullable = false, length = 80)
    private String format;

    @Column(name = "units_per_box", nullable = false)
    private Integer unitsPerBox;

    @Column(nullable = false)
    private Integer boxes;
}

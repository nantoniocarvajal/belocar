package cl.belocar.backend.util;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class SlugGeneratorTest {

    @Test
    void slugifiesSimpleName() {
        assertThat(SlugGenerator.slugify("Tinto Reserva")).isEqualTo("tinto-reserva");
    }

    @Test
    void removesAccentsAndEnie() {
        assertThat(SlugGenerator.slugify("Viña Rocablanca")).isEqualTo("vina-rocablanca");
        assertThat(SlugGenerator.slugify("Edición Limitada")).isEqualTo("edicion-limitada");
    }

    @Test
    void collapsesNonAlphanumericIntoSingleDash() {
        assertThat(SlugGenerator.slugify("Tinto   Reserva!!  Especial")).isEqualTo("tinto-reserva-especial");
    }

    @Test
    void trimsLeadingAndTrailingDashes() {
        assertThat(SlugGenerator.slugify("  Rosado  ")).isEqualTo("rosado");
        assertThat(SlugGenerator.slugify("¡Espumante!")).isEqualTo("espumante");
    }
}

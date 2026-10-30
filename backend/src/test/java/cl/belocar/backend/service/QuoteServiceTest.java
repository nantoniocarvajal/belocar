package cl.belocar.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import cl.belocar.backend.domain.Quote;
import cl.belocar.backend.dto.QuoteItemRequest;
import cl.belocar.backend.dto.QuoteRequest;
import cl.belocar.backend.exception.ResourceNotFoundException;
import cl.belocar.backend.repository.QuoteRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class QuoteServiceTest {

    @Mock
    private QuoteRepository quoteRepository;

    private QuoteService quoteService;

    @BeforeEach
    void setUp() {
        quoteService = new QuoteService(quoteRepository);
    }

    private QuoteRequest sampleRequest() {
        return new QuoteRequest(
                "Juan Pérez",
                "particular",
                "",
                "+56912345678",
                "",
                "Ñuñoa",
                "despacho",
                "  ",
                List.of(
                        new QuoteItemRequest(1L, "Tinto Reserva", "Viña Terrual", "750 ml", 12, 3),
                        new QuoteItemRequest(2L, "Blanco Sauvignon Blanc", "Casa Nogal", "750 ml", 12, 5)));
    }

    @Test
    void createSumsTotalBoxesAcrossItems() {
        when(quoteRepository.save(any(Quote.class))).thenAnswer(invocation -> {
            Quote quote = invocation.getArgument(0);
            quote.setId(1L);
            return quote;
        });

        Long id = quoteService.create(sampleRequest());

        assertThat(id).isEqualTo(1L);
    }

    @Test
    void createStoresQuoteWithBlankOptionalFieldsAsNull() {
        when(quoteRepository.save(any(Quote.class))).thenAnswer(invocation -> {
            Quote quote = invocation.getArgument(0);
            quote.setId(2L);

            assertThat(quote.getCompanyName()).isNull();
            assertThat(quote.getEmail()).isNull();
            assertThat(quote.getNotes()).isNull();
            assertThat(quote.getTotalBoxes()).isEqualTo(8);
            assertThat(quote.getItems()).hasSize(2);
            assertThat(quote.getItems().get(0).getProductBrand()).isEqualTo("Viña Terrual");

            return quote;
        });

        quoteService.create(sampleRequest());
    }

    @Test
    void getForAdminThrowsWhenNotFound() {
        when(quoteRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> quoteService.getForAdmin(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}

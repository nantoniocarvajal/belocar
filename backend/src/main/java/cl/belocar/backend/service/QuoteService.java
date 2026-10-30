package cl.belocar.backend.service;

import cl.belocar.backend.domain.Quote;
import cl.belocar.backend.domain.QuoteItem;
import cl.belocar.backend.dto.QuoteDetailDto;
import cl.belocar.backend.dto.QuoteItemDto;
import cl.belocar.backend.dto.QuoteItemRequest;
import cl.belocar.backend.dto.QuoteRequest;
import cl.belocar.backend.dto.QuoteSummaryDto;
import cl.belocar.backend.exception.ResourceNotFoundException;
import cl.belocar.backend.repository.QuoteRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class QuoteService {

    private final QuoteRepository quoteRepository;

    public QuoteService(QuoteRepository quoteRepository) {
        this.quoteRepository = quoteRepository;
    }

    @Transactional
    public Long create(QuoteRequest request) {
        int totalBoxes = request.items().stream().mapToInt(QuoteItemRequest::boxes).sum();

        Quote quote = Quote.builder()
                .customerName(request.customerName())
                .clientType(request.clientType())
                .companyName(blankToNull(request.companyName()))
                .phone(request.phone())
                .email(blankToNull(request.email()))
                .commune(request.commune())
                .fulfillmentMode(request.fulfillmentMode())
                .notes(blankToNull(request.notes()))
                .totalBoxes(totalBoxes)
                .build();

        List<QuoteItem> items = new ArrayList<>();
        for (QuoteItemRequest itemRequest : request.items()) {
            items.add(QuoteItem.builder()
                    .quote(quote)
                    .productId(itemRequest.productId())
                    .productName(itemRequest.name())
                    .productBrand(itemRequest.brand())
                    .format(itemRequest.format())
                    .unitsPerBox(itemRequest.unitsPerBox())
                    .boxes(itemRequest.boxes())
                    .build());
        }
        quote.setItems(items);

        return quoteRepository.save(quote).getId();
    }

    public List<QuoteSummaryDto> findAllForAdmin() {
        return quoteRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toSummaryDto)
                .toList();
    }

    public QuoteDetailDto getForAdmin(Long id) {
        Quote quote = quoteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cotización no encontrada: " + id));
        return toDetailDto(quote);
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }

    private QuoteSummaryDto toSummaryDto(Quote quote) {
        return new QuoteSummaryDto(
                quote.getId(),
                quote.getCustomerName(),
                quote.getClientType(),
                quote.getPhone(),
                quote.getCommune(),
                quote.getFulfillmentMode(),
                quote.getTotalBoxes(),
                quote.getItems().size(),
                quote.getCreatedAt());
    }

    private QuoteDetailDto toDetailDto(Quote quote) {
        List<QuoteItemDto> items = quote.getItems().stream()
                .map(item -> new QuoteItemDto(
                        item.getProductId(),
                        item.getProductName(),
                        item.getProductBrand(),
                        item.getFormat(),
                        item.getUnitsPerBox(),
                        item.getBoxes()))
                .toList();

        return new QuoteDetailDto(
                quote.getId(),
                quote.getCustomerName(),
                quote.getClientType(),
                quote.getCompanyName(),
                quote.getPhone(),
                quote.getEmail(),
                quote.getCommune(),
                quote.getFulfillmentMode(),
                quote.getNotes(),
                quote.getTotalBoxes(),
                items,
                quote.getCreatedAt());
    }
}

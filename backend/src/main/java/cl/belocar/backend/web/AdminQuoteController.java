package cl.belocar.backend.web;

import cl.belocar.backend.dto.QuoteDetailDto;
import cl.belocar.backend.dto.QuoteSummaryDto;
import cl.belocar.backend.service.QuoteService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/quotes")
public class AdminQuoteController {

    private final QuoteService quoteService;

    public AdminQuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    @GetMapping
    public List<QuoteSummaryDto> findAll() {
        return quoteService.findAllForAdmin();
    }

    @GetMapping("/{id}")
    public QuoteDetailDto getOne(@PathVariable Long id) {
        return quoteService.getForAdmin(id);
    }
}

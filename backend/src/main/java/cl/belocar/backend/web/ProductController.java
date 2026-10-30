package cl.belocar.backend.web;

import cl.belocar.backend.dto.ProductDetailDto;
import cl.belocar.backend.dto.ProductSummaryDto;
import cl.belocar.backend.service.ProductService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductSummaryDto> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Boolean featured) {
        return productService.search(q, category, brand, featured);
    }

    @GetMapping("/{slug}")
    public ProductDetailDto getBySlug(@PathVariable String slug) {
        return productService.getPublishedBySlug(slug);
    }
}

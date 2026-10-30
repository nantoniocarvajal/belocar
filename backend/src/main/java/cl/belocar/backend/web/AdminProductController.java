package cl.belocar.backend.web;

import cl.belocar.backend.dto.ProductAdminDto;
import cl.belocar.backend.dto.ProductRequest;
import cl.belocar.backend.dto.ReorderRequest;
import cl.belocar.backend.service.ProductService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductAdminDto> findAll() {
        return productService.findAllForAdmin();
    }

    @GetMapping("/{id}")
    public ProductAdminDto getOne(@PathVariable Long id) {
        return productService.getForAdmin(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductAdminDto create(@Valid @RequestBody ProductRequest request) {
        return productService.create(request);
    }

    @PutMapping("/{id}")
    public ProductAdminDto update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return productService.update(id, request);
    }

    @PatchMapping("/{id}/publish")
    public ProductAdminDto setPublished(@PathVariable Long id, @RequestParam boolean published) {
        return productService.setPublished(id, published);
    }

    @PatchMapping("/{id}/feature")
    public ProductAdminDto setFeatured(@PathVariable Long id, @RequestParam boolean featured) {
        return productService.setFeatured(id, featured);
    }

    @PostMapping("/reorder")
    public void reorder(@Valid @RequestBody ReorderRequest request) {
        productService.reorder(request.orderedProductIds());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }
}

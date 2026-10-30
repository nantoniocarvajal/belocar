package cl.belocar.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import cl.belocar.backend.domain.Category;
import cl.belocar.backend.domain.Product;
import cl.belocar.backend.dto.ProductAdminDto;
import cl.belocar.backend.dto.ProductRequest;
import cl.belocar.backend.exception.ResourceNotFoundException;
import cl.belocar.backend.repository.ProductRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryService categoryService;

    private ProductService productService;

    private Category tintos;

    @BeforeEach
    void setUp() {
        productService = new ProductService(productRepository, categoryService);
        tintos = Category.builder().id(1L).name("Tintos").slug("tintos").build();
    }

    private ProductRequest sampleRequest() {
        return new ProductRequest(
                "Tinto Reserva",
                "Viña Terrual",
                1L,
                "Cabernet Sauvignon",
                "Descripcion breve",
                "Descripcion completa",
                "750 ml",
                12,
                "/demo/tinto.svg",
                List.of(),
                false,
                false,
                null,
                null);
    }

    @Test
    void createGeneratesUniqueSlugWhenNameIsFree() {
        when(categoryService.getEntity(1L)).thenReturn(tintos);
        when(productRepository.existsBySlug("tinto-reserva")).thenReturn(false);
        when(productRepository.count()).thenReturn(0L);
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product product = invocation.getArgument(0);
            product.setId(10L);
            return product;
        });

        ProductAdminDto result = productService.create(sampleRequest());

        assertThat(result.slug()).isEqualTo("tinto-reserva");
        assertThat(result.categoryName()).isEqualTo("Tintos");
    }

    @Test
    void createAppendsSuffixWhenSlugAlreadyTaken() {
        when(categoryService.getEntity(1L)).thenReturn(tintos);
        when(productRepository.existsBySlug("tinto-reserva")).thenReturn(true);
        when(productRepository.existsBySlug("tinto-reserva-2")).thenReturn(false);
        when(productRepository.count()).thenReturn(3L);
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product product = invocation.getArgument(0);
            product.setId(11L);
            return product;
        });

        ProductAdminDto result = productService.create(sampleRequest());

        assertThat(result.slug()).isEqualTo("tinto-reserva-2");
    }

    @Test
    void getPublishedBySlugThrowsWhenMissing() {
        when(productRepository.findBySlugAndPublishedTrue("no-existe")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getPublishedBySlug("no-existe"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void reorderAssignsDisplayOrderByPosition() {
        Product first = Product.builder().id(1L).category(tintos).build();
        Product second = Product.builder().id(2L).category(tintos).build();
        Product third = Product.builder().id(3L).category(tintos).build();

        when(productRepository.findAllById(List.of(3L, 1L, 2L)))
                .thenReturn(List.of(first, second, third));

        productService.reorder(List.of(3L, 1L, 2L));

        verify(productRepository).saveAll(any());

        assertThat(third.getDisplayOrder()).isEqualTo(0);
        assertThat(first.getDisplayOrder()).isEqualTo(1);
        assertThat(second.getDisplayOrder()).isEqualTo(2);
    }

    @Test
    void searchIgnoresBlankFilters() {
        Specification<Product> anySpec = any();
        when(productRepository.findAll(anySpec)).thenReturn(List.of());

        var results = productService.search("", null, "", null);

        assertThat(results).isEmpty();
    }
}

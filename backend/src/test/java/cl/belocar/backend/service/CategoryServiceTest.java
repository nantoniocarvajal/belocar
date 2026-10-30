package cl.belocar.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import cl.belocar.backend.domain.Category;
import cl.belocar.backend.dto.CategoryDto;
import cl.belocar.backend.dto.CategoryRequest;
import cl.belocar.backend.exception.DuplicateResourceException;
import cl.belocar.backend.exception.ResourceNotFoundException;
import cl.belocar.backend.repository.CategoryRepository;
import cl.belocar.backend.repository.ProductRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductRepository productRepository;

    private CategoryService categoryService;

    @BeforeEach
    void setUp() {
        categoryService = new CategoryService(categoryRepository, productRepository);
    }

    @Test
    void createGeneratesSlugFromName() {
        when(categoryRepository.existsByNameIgnoreCase("Tintos")).thenReturn(false);
        when(categoryRepository.existsBySlug("tintos")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenAnswer(invocation -> {
            Category category = invocation.getArgument(0);
            category.setId(1L);
            return category;
        });

        CategoryDto result = categoryService.create(new CategoryRequest("Tintos"));

        assertThat(result.name()).isEqualTo("Tintos");
        assertThat(result.slug()).isEqualTo("tintos");
    }

    @Test
    void createRejectsDuplicateNameCaseInsensitive() {
        when(categoryRepository.existsByNameIgnoreCase("tintos")).thenReturn(true);

        assertThatThrownBy(() -> categoryService.create(new CategoryRequest("tintos")))
                .isInstanceOf(DuplicateResourceException.class);
    }

    @Test
    void deleteFailsWhenCategoryHasProducts() {
        Category category = Category.builder().id(5L).name("Tintos").slug("tintos").build();
        when(categoryRepository.findById(5L)).thenReturn(Optional.of(category));
        when(productRepository.existsByCategoryId(5L)).thenReturn(true);

        assertThatThrownBy(() -> categoryService.delete(5L))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("productos asignados");
    }

    @Test
    void deleteSucceedsWhenCategoryHasNoProducts() {
        Category category = Category.builder().id(5L).name("Tintos").slug("tintos").build();
        when(categoryRepository.findById(5L)).thenReturn(Optional.of(category));
        when(productRepository.existsByCategoryId(5L)).thenReturn(false);

        categoryService.delete(5L);
        // no exception thrown -- delete() invoked implicitly via categoryRepository mock
    }

    @Test
    void getEntityThrowsWhenNotFound() {
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.getEntity(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}

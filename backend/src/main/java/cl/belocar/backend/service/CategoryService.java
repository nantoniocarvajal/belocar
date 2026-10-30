package cl.belocar.backend.service;

import cl.belocar.backend.domain.Category;
import cl.belocar.backend.dto.CategoryDto;
import cl.belocar.backend.dto.CategoryRequest;
import cl.belocar.backend.exception.DuplicateResourceException;
import cl.belocar.backend.exception.ResourceNotFoundException;
import cl.belocar.backend.repository.CategoryRepository;
import cl.belocar.backend.repository.ProductRepository;
import cl.belocar.backend.util.SlugGenerator;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    public List<CategoryDto> findAll() {
        return categoryRepository.findAllByOrderByNameAsc().stream()
                .map(this::toDto)
                .toList();
    }

    public Category getEntity(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada: " + id));
    }

    @Transactional
    public CategoryDto create(CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.name())) {
            throw new DuplicateResourceException("Ya existe una categoría con ese nombre");
        }

        String slug = SlugGenerator.slugify(request.name());
        if (categoryRepository.existsBySlug(slug)) {
            throw new DuplicateResourceException("Ya existe una categoría con un nombre muy similar");
        }

        Category category = Category.builder()
                .name(request.name())
                .slug(slug)
                .build();

        return toDto(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDto update(Long id, CategoryRequest request) {
        Category category = getEntity(id);

        if (!category.getName().equalsIgnoreCase(request.name())
                && categoryRepository.existsByNameIgnoreCase(request.name())) {
            throw new DuplicateResourceException("Ya existe una categoría con ese nombre");
        }

        category.setName(request.name());
        category.setSlug(SlugGenerator.slugify(request.name()));
        return toDto(categoryRepository.save(category));
    }

    @Transactional
    public void delete(Long id) {
        Category category = getEntity(id);
        if (productRepository.existsByCategoryId(id)) {
            throw new DuplicateResourceException(
                    "No se puede eliminar la categoría porque tiene productos asignados");
        }
        categoryRepository.delete(category);
    }

    private CategoryDto toDto(Category category) {
        return new CategoryDto(category.getId(), category.getName(), category.getSlug());
    }
}

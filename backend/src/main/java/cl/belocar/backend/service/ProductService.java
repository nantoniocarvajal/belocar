package cl.belocar.backend.service;

import cl.belocar.backend.domain.Category;
import cl.belocar.backend.domain.Product;
import cl.belocar.backend.domain.ProductImage;
import cl.belocar.backend.dto.ProductAdminDto;
import cl.belocar.backend.dto.ProductDetailDto;
import cl.belocar.backend.dto.ProductRequest;
import cl.belocar.backend.dto.ProductSummaryDto;
import cl.belocar.backend.exception.ResourceNotFoundException;
import cl.belocar.backend.repository.ProductRepository;
import cl.belocar.backend.repository.ProductSpecifications;
import cl.belocar.backend.util.SlugGenerator;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    public ProductService(ProductRepository productRepository, CategoryService categoryService) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
    }

    public List<ProductSummaryDto> search(String query, String categorySlug, String brand, Boolean featured) {
        Specification<Product> spec = Specification.allOf(
                ProductSpecifications.published(),
                ProductSpecifications.nameContains(query),
                ProductSpecifications.categorySlugEquals(categorySlug),
                ProductSpecifications.brandEquals(brand),
                ProductSpecifications.featuredOnly(featured));

        return productRepository.findAll(spec).stream()
                .sorted((a, b) -> a.getDisplayOrder().compareTo(b.getDisplayOrder()))
                .map(this::toSummaryDto)
                .toList();
    }

    public ProductDetailDto getPublishedBySlug(String slug) {
        Product product = productRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + slug));
        return toDetailDto(product);
    }

    public List<ProductAdminDto> findAllForAdmin() {
        return productRepository.findAllByOrderByDisplayOrderAscNameAsc().stream()
                .map(this::toAdminDto)
                .toList();
    }

    public ProductAdminDto getForAdmin(Long id) {
        return toAdminDto(getEntity(id));
    }

    @Transactional
    public ProductAdminDto create(ProductRequest request) {
        Category category = categoryService.getEntity(request.categoryId());
        String slug = generateUniqueSlug(request.name(), null);

        Product product = Product.builder()
                .name(request.name())
                .slug(slug)
                .brand(request.brand())
                .category(category)
                .varietal(request.varietal())
                .shortDescription(request.shortDescription())
                .fullDescription(request.fullDescription())
                .format(request.format())
                .unitsPerBox(request.unitsPerBox())
                .mainImageUrl(request.mainImageUrl())
                .featured(request.featured())
                .published(request.published())
                .displayOrder(request.displayOrder() != null ? request.displayOrder() : nextDisplayOrder())
                .internalNotes(request.internalNotes())
                .build();

        applyAdditionalImages(product, request.additionalImageUrls());

        return toAdminDto(productRepository.save(product));
    }

    @Transactional
    public ProductAdminDto update(Long id, ProductRequest request) {
        Product product = getEntity(id);
        Category category = categoryService.getEntity(request.categoryId());

        if (!product.getName().equals(request.name())) {
            product.setSlug(generateUniqueSlug(request.name(), product.getId()));
        }

        product.setName(request.name());
        product.setBrand(request.brand());
        product.setCategory(category);
        product.setVarietal(request.varietal());
        product.setShortDescription(request.shortDescription());
        product.setFullDescription(request.fullDescription());
        product.setFormat(request.format());
        product.setUnitsPerBox(request.unitsPerBox());
        product.setMainImageUrl(request.mainImageUrl());
        product.setFeatured(request.featured());
        product.setPublished(request.published());
        if (request.displayOrder() != null) {
            product.setDisplayOrder(request.displayOrder());
        }
        product.setInternalNotes(request.internalNotes());

        applyAdditionalImages(product, request.additionalImageUrls());

        return toAdminDto(productRepository.save(product));
    }

    @Transactional
    public ProductAdminDto setPublished(Long id, boolean published) {
        Product product = getEntity(id);
        product.setPublished(published);
        return toAdminDto(productRepository.save(product));
    }

    @Transactional
    public ProductAdminDto setFeatured(Long id, boolean featured) {
        Product product = getEntity(id);
        product.setFeatured(featured);
        return toAdminDto(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        Product product = getEntity(id);
        productRepository.delete(product);
    }

    @Transactional
    public void reorder(List<Long> orderedProductIds) {
        Map<Long, Product> productsById = productRepository.findAllById(orderedProductIds).stream()
                .collect(java.util.stream.Collectors.toMap(Product::getId, p -> p));

        for (int i = 0; i < orderedProductIds.size(); i++) {
            Product product = productsById.get(orderedProductIds.get(i));
            if (product != null) {
                product.setDisplayOrder(i);
            }
        }
        productRepository.saveAll(productsById.values());
    }

    private Product getEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + id));
    }

    private void applyAdditionalImages(Product product, List<String> urls) {
        product.getAdditionalImages().clear();
        if (urls == null) {
            return;
        }
        List<ProductImage> images = new ArrayList<>();
        for (int i = 0; i < urls.size(); i++) {
            images.add(ProductImage.builder()
                    .product(product)
                    .url(urls.get(i))
                    .displayOrder(i)
                    .build());
        }
        product.getAdditionalImages().addAll(images);
    }

    private String generateUniqueSlug(String name, Long ignoreProductId) {
        String base = SlugGenerator.slugify(name);
        String candidate = base;
        int suffix = 2;
        while (slugTakenByOther(candidate, ignoreProductId)) {
            candidate = base + "-" + suffix;
            suffix++;
        }
        return candidate;
    }

    private boolean slugTakenByOther(String slug, Long ignoreProductId) {
        return ignoreProductId == null
                ? productRepository.existsBySlug(slug)
                : productRepository.existsBySlugAndIdNot(slug, ignoreProductId);
    }

    private int nextDisplayOrder() {
        return (int) productRepository.count();
    }

    private ProductSummaryDto toSummaryDto(Product product) {
        return new ProductSummaryDto(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getBrand(),
                product.getCategory().getName(),
                product.getCategory().getSlug(),
                product.getFormat(),
                product.getUnitsPerBox(),
                product.getMainImageUrl(),
                product.getShortDescription(),
                product.isFeatured());
    }

    private ProductDetailDto toDetailDto(Product product) {
        return new ProductDetailDto(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getBrand(),
                product.getCategory().getName(),
                product.getCategory().getSlug(),
                product.getVarietal(),
                product.getShortDescription(),
                product.getFullDescription(),
                product.getFormat(),
                product.getUnitsPerBox(),
                product.getMainImageUrl(),
                product.getAdditionalImages().stream().map(ProductImage::getUrl).toList(),
                product.isFeatured());
    }

    private ProductAdminDto toAdminDto(Product product) {
        return new ProductAdminDto(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getBrand(),
                product.getCategory().getId(),
                product.getCategory().getName(),
                product.getVarietal(),
                product.getShortDescription(),
                product.getFullDescription(),
                product.getFormat(),
                product.getUnitsPerBox(),
                product.getMainImageUrl(),
                product.getAdditionalImages().stream().map(ProductImage::getUrl).toList(),
                product.isFeatured(),
                product.isPublished(),
                product.getDisplayOrder(),
                product.getInternalNotes(),
                product.getCreatedAt(),
                product.getUpdatedAt());
    }
}

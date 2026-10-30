package cl.belocar.backend.repository;

import cl.belocar.backend.domain.Product;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class ProductSpecifications {

    private ProductSpecifications() {
    }

    public static Specification<Product> published() {
        return (root, query, cb) -> cb.isTrue(root.get("published"));
    }

    public static Specification<Product> nameContains(String search) {
        if (!StringUtils.hasText(search)) {
            return null;
        }
        String pattern = "%" + search.toLowerCase().trim() + "%";
        return (root, query, cb) -> cb.like(cb.lower(root.get("name")), pattern);
    }

    public static Specification<Product> categorySlugEquals(String categorySlug) {
        if (!StringUtils.hasText(categorySlug)) {
            return null;
        }
        return (root, query, cb) -> cb.equal(root.get("category").get("slug"), categorySlug);
    }

    public static Specification<Product> brandEquals(String brand) {
        if (!StringUtils.hasText(brand)) {
            return null;
        }
        return (root, query, cb) -> cb.equal(root.get("brand"), brand);
    }

    public static Specification<Product> featuredOnly(Boolean featured) {
        if (featured == null || !featured) {
            return null;
        }
        return (root, query, cb) -> cb.isTrue(root.get("featured"));
    }
}

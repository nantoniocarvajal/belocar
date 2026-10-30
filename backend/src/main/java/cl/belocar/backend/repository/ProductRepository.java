package cl.belocar.backend.repository;

import cl.belocar.backend.domain.Product;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductRepository
        extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlugAndPublishedTrue(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    List<Product> findAllByOrderByDisplayOrderAscNameAsc();

    List<Product> findAllByPublishedTrueOrderByDisplayOrderAscNameAsc();

    boolean existsByCategoryId(Long categoryId);
}

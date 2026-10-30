package cl.belocar.backend.repository;

import cl.belocar.backend.domain.SiteConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteConfigRepository extends JpaRepository<SiteConfig, Long> {
}

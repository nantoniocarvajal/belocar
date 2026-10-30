package cl.belocar.backend.repository;

import cl.belocar.backend.domain.Quote;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuoteRepository extends JpaRepository<Quote, Long> {

    List<Quote> findAllByOrderByCreatedAtDesc();
}

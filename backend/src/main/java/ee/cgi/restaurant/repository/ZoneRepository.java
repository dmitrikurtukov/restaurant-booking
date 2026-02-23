package ee.cgi.restaurant.repository;

import ee.cgi.restaurant.domain.Zone;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ZoneRepository extends JpaRepository<Zone, Long> {
}

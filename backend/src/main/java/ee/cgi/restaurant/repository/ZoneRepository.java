package ee.cgi.restaurant.repository;

import ee.cgi.restaurant.domain.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ZoneRepository extends JpaRepository<Zone, Long> {

    // Solving N + 1 problem
    @Query("select distinct z from Zone z left join fetch z.tables")
    List<Zone> findAllWithTables();
}

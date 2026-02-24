package ee.cgi.restaurant.repository;

import ee.cgi.restaurant.domain.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
    List<RestaurantTable> findAllByZoneId(Long zoneId);
}

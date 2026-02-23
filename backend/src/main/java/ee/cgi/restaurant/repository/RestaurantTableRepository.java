package ee.cgi.restaurant.repository;

import ee.cgi.restaurant.domain.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
}

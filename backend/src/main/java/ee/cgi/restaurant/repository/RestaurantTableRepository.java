package ee.cgi.restaurant.repository;

import ee.cgi.restaurant.domain.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
    @Query("select t from RestaurantTable t join fetch t.zone")
    List<RestaurantTable> findAllWithZone();

    @Query("select t from RestaurantTable t join fetch t.zone where t.zone.id = :zoneId")
    List<RestaurantTable> findAllByZoneIdWithZone(@Param("zoneId") Long zoneId);
}

package ee.cgi.restaurant.repository;

import ee.cgi.restaurant.domain.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByTableIdAndStartTimeLessThanAndEndTimeGreaterThan(
            Long tableId,
            LocalDateTime end,
            LocalDateTime start
    );
}

package ee.cgi.restaurant.repository;

import ee.cgi.restaurant.domain.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    boolean existsByTableIdAndStartTimeLessThanAndEndTimeGreaterThan(
            Long tableId,
            LocalDateTime end,
            LocalDateTime start
    );

    @Query("""
            select distinct r.table.id
            from Reservation r
            where r.startTime < :end and r.endTime > :start
            """)
    List<Long> findOccupiedTableIds(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}

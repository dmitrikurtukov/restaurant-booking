package ee.cgi.restaurant.service;

import ee.cgi.restaurant.api.dto.CreateReservationRequest;
import ee.cgi.restaurant.domain.Reservation;
import ee.cgi.restaurant.domain.RestaurantTable;
import ee.cgi.restaurant.repository.ReservationRepository;
import ee.cgi.restaurant.repository.RestaurantTableRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private static final int DEFAULT_DURATION_MINUTES = 120;

    private final ReservationRepository reservationRepository;
    private final RestaurantTableRepository restaurantTableRepository;

    @Transactional
    public Long create(CreateReservationRequest req) {
        RestaurantTable table = restaurantTableRepository.findById(req.tableId())
                .orElseThrow(() -> new EntityNotFoundException("Table not found: " + req.tableId()));

        if (table.getCapacity() < req.partySize()) {
            throw new IllegalArgumentException("Table capacity is too small");
        }

        int duration = (req.durationMinutes() == null) ? DEFAULT_DURATION_MINUTES : req.durationMinutes();
        LocalDateTime end = req.start().plusMinutes(duration);

        if (!end.isAfter(req.start())) {
            throw new IllegalArgumentException("Reservation end time must be after start time");
        }

        boolean overlaps = reservationRepository
                .existsByTableIdAndStartTimeLessThanAndEndTimeGreaterThan(table.getId(), end, req.start());

        if (overlaps) {
            throw new IllegalStateException("Table is already reserved for this time range");
        }

        Reservation reservation = Reservation.builder()
                .table(table)
                .startTime(req.start())
                .endTime(end)
                .partySize(req.partySize())
                .build();

        reservationRepository.save(reservation);
        return reservation.getId();
    }
}

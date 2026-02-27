package ee.cgi.restaurant.service;

import ee.cgi.restaurant.api.dto.CreateReservationRequest;
import ee.cgi.restaurant.domain.Reservation;
import ee.cgi.restaurant.domain.RestaurantTable;
import ee.cgi.restaurant.domain.Zone;
import ee.cgi.restaurant.repository.ReservationRepository;
import ee.cgi.restaurant.repository.RestaurantTableRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ReservationServiceTest {

    private ReservationRepository reservationRepository;
    private RestaurantTableRepository restaurantTableRepository;
    private ReservationService reservationService;

    @BeforeEach
    void setUp() {
        reservationRepository = mock(ReservationRepository.class);
        restaurantTableRepository = mock(RestaurantTableRepository.class);
        reservationService = new ReservationService(reservationRepository, restaurantTableRepository);
    }

    @Test
    void throwsNotFoundWhenTableDoesNotExist() {
        when(restaurantTableRepository.findById(999L)).thenReturn(Optional.empty());

        CreateReservationRequest request = new CreateReservationRequest(
                999L,
                LocalDateTime.parse("2026-02-27T19:00:00"),
                2,
                120,
                null
        );

        assertThatThrownBy(() -> reservationService.create(request))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Table not found");
    }

    @Test
    void throwsBadRequestWhenTableCapacityIsTooSmall() {
        RestaurantTable table = table(2);
        when(restaurantTableRepository.findById(1L)).thenReturn(Optional.of(table));

        CreateReservationRequest request = new CreateReservationRequest(
                1L,
                LocalDateTime.parse("2026-02-27T19:00:00"),
                4,
                120,
                null
        );

        assertThatThrownBy(() -> reservationService.create(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("capacity is too small");
    }

    @Test
    void throwsConflictWhenReservationOverlaps() {
        RestaurantTable table = table(4);
        LocalDateTime start = LocalDateTime.parse("2026-02-27T19:00:00");

        when(restaurantTableRepository.findById(1L)).thenReturn(Optional.of(table));
        when(reservationRepository.existsByTableIdAndStartTimeLessThanAndEndTimeGreaterThan(
                1L,
                start.plusMinutes(120),
                start
        )).thenReturn(true);

        CreateReservationRequest request = new CreateReservationRequest(
                1L,
                start,
                2,
                120,
                null
        );

        assertThatThrownBy(() -> reservationService.create(request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("already reserved");
    }

    @Test
    void createsReservationSuccessfully() {
        RestaurantTable table = table(4);
        LocalDateTime start = LocalDateTime.parse("2026-02-27T19:00:00");

        when(restaurantTableRepository.findById(1L)).thenReturn(Optional.of(table));
        when(reservationRepository.existsByTableIdAndStartTimeLessThanAndEndTimeGreaterThan(
                1L,
                start.plusMinutes(120),
                start
        )).thenReturn(false);

        when(reservationRepository.save(any(Reservation.class))).thenAnswer(invocation -> {
            Reservation r = invocation.getArgument(0);
            r.setId(42L);
            return r;
        });

        CreateReservationRequest request = new CreateReservationRequest(
                1L,
                start,
                2,
                120,
                null
        );

        Long id = reservationService.create(request);

        assertThat(id).isEqualTo(42L);

        ArgumentCaptor<Reservation> captor = ArgumentCaptor.forClass(Reservation.class);
        verify(reservationRepository).save(captor.capture());
        Reservation saved = captor.getValue();

        assertThat(saved.getTable().getId()).isEqualTo(1L);
        assertThat(saved.getStartTime()).isEqualTo(start);
        assertThat(saved.getEndTime()).isEqualTo(start.plusMinutes(120));
        assertThat(saved.getPartySize()).isEqualTo(2);
    }

    private RestaurantTable table(int capacity) {
        Zone zone = Zone.builder().id(1L).name("Main Hall").build();
        return RestaurantTable.builder()
                .id(1L)
                .capacity(capacity)
                .xPosition(10)
                .yPosition(10)
                .zone(zone)
                .build();
    }
}

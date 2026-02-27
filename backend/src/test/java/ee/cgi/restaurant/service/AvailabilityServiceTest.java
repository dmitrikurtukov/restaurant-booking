package ee.cgi.restaurant.service;

import ee.cgi.restaurant.api.dto.AvailabilityResponse;
import ee.cgi.restaurant.api.dto.TablePreference;
import ee.cgi.restaurant.config.AvailabilityProperties;
import ee.cgi.restaurant.domain.RestaurantTable;
import ee.cgi.restaurant.domain.TableFeature;
import ee.cgi.restaurant.domain.Zone;
import ee.cgi.restaurant.repository.ReservationRepository;
import ee.cgi.restaurant.repository.RestaurantTableRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AvailabilityServiceTest {

    private RestaurantTableRepository tableRepository;
    private ReservationRepository reservationRepository;
    private AvailabilityService availabilityService;

    @BeforeEach
    void setUp() {
        tableRepository = Mockito.mock(RestaurantTableRepository.class);
        reservationRepository = Mockito.mock(ReservationRepository.class);
        AvailabilityProperties properties = new AvailabilityProperties();
        properties.setMode(AvailabilityProperties.Mode.REAL);

        availabilityService = new AvailabilityService(tableRepository, reservationRepository, properties);
    }

    @Test
    void recommendsBestFitWhenNoPreferences() {
        Zone zone = Zone.builder().id(1L).name("Main Hall").build();

        RestaurantTable t1 = RestaurantTable.builder()
                .id(1L).capacity(2).xPosition(10).yPosition(10).zone(zone)
                .features(Set.of(TableFeature.QUIET))
                .build();

        RestaurantTable t2 = RestaurantTable.builder()
                .id(2L).capacity(4).xPosition(20).yPosition(10).zone(zone)
                .features(Set.of(TableFeature.WINDOW))
                .build();

        when(tableRepository.findAllWithZone()).thenReturn(List.of(t1, t2));
        when(reservationRepository.findOccupiedTableIds(any(), any())).thenReturn(List.of());

        AvailabilityResponse response = availabilityService.getAvailability(
                LocalDateTime.parse("2026-02-27T19:00:00"),
                LocalDateTime.parse("2026-02-27T21:00:00"),
                2,
                null,
                List.of()
        );

        assertThat(response.recommendedTableId()).isEqualTo(1L);
        assertThat(response.topRecommendations()).containsExactly(1L, 2L);
    }

    @Test
    void prefersMatchingFeaturesWhenPreferencesProvided() {
        Zone zone = Zone.builder().id(1L).name("Main Hall").build();

        RestaurantTable t1 = RestaurantTable.builder()
                .id(1L).capacity(2).xPosition(10).yPosition(10).zone(zone)
                .features(Set.of(TableFeature.QUIET))
                .build();

        RestaurantTable t2 = RestaurantTable.builder()
                .id(2L).capacity(2).xPosition(20).yPosition(10).zone(zone)
                .features(Set.of(TableFeature.WINDOW, TableFeature.QUIET))
                .build();

        when(tableRepository.findAllWithZone()).thenReturn(List.of(t1, t2));
        when(reservationRepository.findOccupiedTableIds(any(), any())).thenReturn(List.of());

        AvailabilityResponse response = availabilityService.getAvailability(
                LocalDateTime.parse("2026-02-27T19:00:00"),
                LocalDateTime.parse("2026-02-27T21:00:00"),
                2,
                null,
                List.of(TablePreference.WINDOW)
        );

        assertThat(response.recommendedTableId()).isEqualTo(2L);
        assertThat(response.topRecommendations()).containsExactly(2L, 1L);
    }
}

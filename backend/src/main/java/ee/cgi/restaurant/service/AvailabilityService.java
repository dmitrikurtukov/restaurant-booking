package ee.cgi.restaurant.service;

import ee.cgi.restaurant.api.dto.AvailabilityResponse;
import ee.cgi.restaurant.api.dto.TablePreference;
import ee.cgi.restaurant.domain.RestaurantTable;
import ee.cgi.restaurant.repository.ReservationRepository;
import ee.cgi.restaurant.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AvailabilityService {
    private final RestaurantTableRepository restaurantTableRepository;
    private final ReservationRepository reservationRepository;

    @Transactional(readOnly = true)
    public AvailabilityResponse getAvailability(
            LocalDateTime start,
            LocalDateTime end,
            int partySize,
            Long zoneId,
            List<TablePreference> preferences
    ) {
        List<RestaurantTable> tables = zoneId == null
                ? restaurantTableRepository.findAllWithZone()
                : restaurantTableRepository.findAllByZoneIdWithZone(zoneId);

        Set<Long> occupiedByReservations = new HashSet<>(reservationRepository.findOccupiedTableIds(start, end));
        Set<Long> occupiedRandom = generateDeterministicOccupiedTables(tables, start, end);
        Set<Long> occupiedTableIds = new HashSet<>(occupiedByReservations);
        occupiedTableIds.addAll(occupiedRandom);

        List<AvailabilityResponse.TableAvailabilityDto> result = new ArrayList<>();
        for (RestaurantTable t : tables) {
            boolean tooSmall = t.getCapacity() < partySize;
            boolean isOccupied = occupiedTableIds.contains(t.getId());

            AvailabilityResponse.TableStatus status;
            if (tooSmall) status = AvailabilityResponse.TableStatus.TOO_SMALL;
            else if (isOccupied) status = AvailabilityResponse.TableStatus.OCCUPIED;
            else status = AvailabilityResponse.TableStatus.FREE;

            int score = computeScore(t, partySize, preferences, status);
            result.add(new AvailabilityResponse.TableAvailabilityDto(
                    t.getId(),
                    t.getCapacity(),
                    t.getXPosition(),
                    t.getYPosition(),
                    t.getZone().getId(),
                    status,
                    score
            ));
        }

        List<AvailabilityResponse.TableAvailabilityDto> freeTablesSorted = result.stream()
                .filter(dto -> dto.status() == AvailabilityResponse.TableStatus.FREE)
                .sorted(Comparator.comparingInt(AvailabilityResponse.TableAvailabilityDto::score).reversed())
                .toList();

        Long recommendedId = freeTablesSorted.isEmpty() ? null : freeTablesSorted.getFirst().id();
        List<Long> top3 = freeTablesSorted.stream().limit(3).map(AvailabilityResponse.TableAvailabilityDto::id).toList();

        return new AvailabilityResponse(result, recommendedId, top3);
    }

    private Set<Long> generateDeterministicOccupiedTables(List<RestaurantTable> tables, LocalDateTime start, LocalDateTime end) {
        long seed = Objects.hash(start, end);
        Set<Long> occupied = new HashSet<>();

        for (RestaurantTable t : tables) {
            long mixed = seed ^ (t.getId() * 31L);
            Random r = new Random(mixed);
            boolean isOccupied = r.nextDouble() < 0.25;
            if (isOccupied) occupied.add(t.getId());
        }
        return occupied;
    }

    private int computeScore(RestaurantTable table, int partySize, List<TablePreference> preferences, AvailabilityResponse.TableStatus status) {
        if (status != AvailabilityResponse.TableStatus.FREE) return Integer.MIN_VALUE;

        int waste = table.getCapacity() - partySize;
        int fitScore = 100 - (waste * 10);

        int preferenceScore = 0;
        if (preferences != null) {
            preferenceScore += preferences.size() * 2;
        }

        return fitScore + preferenceScore;
    }
}

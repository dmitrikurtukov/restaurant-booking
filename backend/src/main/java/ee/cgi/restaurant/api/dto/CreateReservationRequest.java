package ee.cgi.restaurant.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public record CreateReservationRequest(
        @NotNull Long tableId,
        @NotNull LocalDateTime start,
        @Min(1) int partySize,
        Integer durationMinutes,
        List<TablePreference> preferences
) {
}

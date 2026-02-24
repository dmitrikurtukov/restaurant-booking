package ee.cgi.restaurant.api.dto;

import java.util.List;

public record AvailabilityResponse(
        List<TableAvailabilityDto> tables,
        Long recommendedTableId,
        List<Long> topRecommendations
) {
    public enum TableStatus {
        FREE,
        OCCUPIED,
        TOO_SMALL
    }

    public record TableAvailabilityDto(
            Long id,
            int capacity,
            int xPosition,
            int yPosition,
            Long zoneId,
            TableStatus status,
            int score
    ) {
    }
}

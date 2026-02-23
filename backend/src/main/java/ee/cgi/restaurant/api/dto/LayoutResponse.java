package ee.cgi.restaurant.api.dto;

import java.util.List;

public record LayoutResponse(List<ZoneDto> zones) {
    public record ZoneDto(Long id, String name, List<TableDto> tables) {
    }

    public record TableDto(Long id, Integer capacity, Integer xPosition, Integer yPosition, Long zoneId) {
    }
}

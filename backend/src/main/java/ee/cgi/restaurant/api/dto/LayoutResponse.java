package ee.cgi.restaurant.api.dto;

import ee.cgi.restaurant.domain.TableFeature;

import java.util.List;
import java.util.Set;

public record LayoutResponse(List<ZoneDto> zones) {
    public record ZoneDto(Long id, String name, List<TableDto> tables) {
    }

    public record TableDto(
            Long id,
            Integer capacity,
            Integer xPosition,
            Integer yPosition,
            Long zoneId,
            Set<TableFeature> features
    ) {
    }
}

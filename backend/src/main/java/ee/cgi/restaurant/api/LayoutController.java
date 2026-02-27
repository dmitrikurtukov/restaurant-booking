package ee.cgi.restaurant.api;

import ee.cgi.restaurant.api.dto.LayoutResponse;
import ee.cgi.restaurant.domain.Zone;
import ee.cgi.restaurant.repository.ZoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LayoutController {
    private final ZoneRepository zoneRepository;

    @GetMapping("/layout")
    public LayoutResponse getLayout() {
        List<Zone> zones = zoneRepository.findAllWithTables();

        List<LayoutResponse.ZoneDto> zoneDtos = zones.stream()
                .map(z -> new LayoutResponse.ZoneDto(
                        z.getId(),
                        z.getName(),
                        z.getTables().stream().map(t -> new LayoutResponse.TableDto(
                                t.getId(),
                                t.getCapacity(),
                                t.getXPosition(),
                                t.getYPosition(),
                                t.getZone().getId(),
                                t.getFeatures()
                        )).toList()
                ))
                .toList();

        return new LayoutResponse(zoneDtos);
    }
}

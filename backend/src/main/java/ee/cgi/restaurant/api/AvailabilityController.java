package ee.cgi.restaurant.api;

import ee.cgi.restaurant.api.dto.AvailabilityResponse;
import ee.cgi.restaurant.api.dto.TablePreference;
import ee.cgi.restaurant.service.AvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AvailabilityController {
    private final AvailabilityService availabilityService;

    @GetMapping("/availability")
    public AvailabilityResponse getAvailability(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam int partySize,
            @RequestParam(required = false) Long zoneId,
            @RequestParam(required = false) String preferences
    ) {
        List<TablePreference> prefs = parsePreferences(preferences);
        return availabilityService.getAvailability(start, partySize, zoneId, prefs);
    }

    private List<TablePreference> parsePreferences(String preferences) {
        if (preferences == null || preferences.isBlank()) return List.of();

        return Arrays.stream(preferences.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(String::toUpperCase)
                .map(TablePreference::valueOf)
                .toList();
    }
}

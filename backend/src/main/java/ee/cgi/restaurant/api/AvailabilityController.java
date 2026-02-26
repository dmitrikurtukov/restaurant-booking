package ee.cgi.restaurant.api;

import ee.cgi.restaurant.api.dto.AvailabilityResponse;
import ee.cgi.restaurant.api.dto.TablePreference;
import ee.cgi.restaurant.service.AvailabilityService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
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
@Validated
public class AvailabilityController {
    private final AvailabilityService availabilityService;

    @GetMapping("/availability")
    public AvailabilityResponse getAvailability(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @Min(1) int partySize,
            @RequestParam(required = false) Long zoneId,
            @RequestParam(required = false) String preferences,
            @RequestParam(required = false, defaultValue = "120") @Min(1) int durationMinutes
    ) {
        List<TablePreference> prefs = parsePreferences(preferences);
        LocalDateTime end = start.plusMinutes(durationMinutes);
        return availabilityService.getAvailability(start, end, partySize, zoneId, prefs);
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

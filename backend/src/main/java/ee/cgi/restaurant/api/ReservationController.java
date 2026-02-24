package ee.cgi.restaurant.api;

import ee.cgi.restaurant.api.dto.CreateReservationRequest;
import ee.cgi.restaurant.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationService reservationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Long create(@Valid @RequestBody CreateReservationRequest request) {
        return reservationService.create(request);
    }
}

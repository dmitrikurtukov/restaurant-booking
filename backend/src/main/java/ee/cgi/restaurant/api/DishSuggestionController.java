package ee.cgi.restaurant.api;

import ee.cgi.restaurant.api.dto.DishSuggestionResponse;
import ee.cgi.restaurant.service.DishSuggestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DishSuggestionController {
    private final DishSuggestionService dishSuggestionService;

    @GetMapping("/dish-suggestion")
    public DishSuggestionResponse getDishSuggestion() {
        return dishSuggestionService.getRandomDish();
    }
}


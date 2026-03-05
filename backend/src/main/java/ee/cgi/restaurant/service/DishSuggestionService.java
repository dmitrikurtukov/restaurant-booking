package ee.cgi.restaurant.service;

import ee.cgi.restaurant.api.dto.DishSuggestionResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;

@Slf4j
@Service
public class DishSuggestionService {
    private static final String RANDOM_MEAL_ENDPOINT = "https://www.themealdb.com/api/json/v1/1/random.php";

    private final RestClient restClient = RestClient.create();

    public DishSuggestionResponse getRandomDish() {
        try {
            JsonNode root = restClient.get()
                    .uri(RANDOM_MEAL_ENDPOINT)
                    .retrieve()
                    .body(JsonNode.class);

            if (root == null) return fallback();

            JsonNode meals = root.path("meals");
            if (!meals.isArray() || meals.isEmpty()) return fallback();

            JsonNode meal = meals.get(0);
            return new DishSuggestionResponse(
                    textOrNull(meal, "strMeal"),
                    textOrNull(meal, "strCategory"),
                    textOrNull(meal, "strArea"),
                    textOrNull(meal, "strMealThumb"),
                    textOrNull(meal, "strSource")
            );
        } catch (Exception ex) {
            log.warn("TheMealDB request failed", ex);
            return fallback();
        }
    }

    private DishSuggestionResponse fallback() {
        return new DishSuggestionResponse(
                "Chef's Special",
                "Daily suggestion",
                null,
                null,
                null
        );
    }

    private String textOrNull(JsonNode node, String field) {
        JsonNode value = node.path(field);
        if (value.isMissingNode() || value.isNull()) return null;
        String text = value.asString();
        return text == null || text.isBlank() ? null : text;
    }
}

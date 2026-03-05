package ee.cgi.restaurant.api.dto;

public record DishSuggestionResponse(
        String name,
        String category,
        String cuisine,
        String imageUrl,
        String sourceUrl
) {
}


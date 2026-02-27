package ee.cgi.restaurant.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.availability")
@Getter
@Setter
public class AvailabilityProperties {
    private Mode mode = Mode.MIXED;

    public enum Mode {
        RANDOM,
        MIXED,
        REAL
    }
}

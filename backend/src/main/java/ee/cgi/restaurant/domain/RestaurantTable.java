package ee.cgi.restaurant.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "restaurant_table")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class RestaurantTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "x_position", nullable = false)
    private Integer xPosition;

    @Column(name = "y_position", nullable = false)
    private Integer yPosition;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "zone_id", nullable = false)
    private Zone zone;
}

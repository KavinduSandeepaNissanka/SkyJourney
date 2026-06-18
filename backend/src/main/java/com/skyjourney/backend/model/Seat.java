package com.skyjourney.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seat")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Column(name = "seat_row", nullable = false)
    private Integer row;

    @Column(name = "seat_col", nullable = false)
    private String col;

    @Column(nullable = false)
    private String type; // WINDOW, MIDDLE, AISLE

    @Column(nullable = false)
    private String status; // AVAILABLE, BOOKED
}

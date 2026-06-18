package com.skyjourney.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "flight")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "flight_no", nullable = false)
    private String flightNo;

    @Column(nullable = false)
    private String origin;

    @Column(nullable = false)
    private String destination;

    @Column(name = "depart_time", nullable = false)
    private LocalDateTime departTime;

    @Column(name = "arrive_time", nullable = false)
    private LocalDateTime arriveTime;

    private String gate;

    @Column(nullable = false)
    private String status; // SCHEDULED, BOARDING, IN_AIR, DELAYED, ARRIVED, CANCELLED
}

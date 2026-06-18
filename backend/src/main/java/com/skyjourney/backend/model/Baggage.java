package com.skyjourney.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "baggage")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Baggage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "tag_no", nullable = false, unique = true)
    private String tagNo;

    @Column(nullable = false)
    private String status; // CHECKED_IN, LOADED, IN_TRANSIT, ARRIVED, BELT_CLAIM

    private String location;

    @Column(name = "belt_no")
    private String beltNo;
}

package com.skyjourney.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "seat_exchange_request")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatExchangeRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_booking_id", nullable = false)
    private Booking requesterBooking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_seat_id", nullable = false)
    private Seat targetSeat;

    @Column(nullable = false)
    private String status; // PENDING, ACCEPTED, REJECTED

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}

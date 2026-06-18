package com.skyjourney.backend.repository;

import com.skyjourney.backend.model.SeatExchangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeatExchangeRequestRepository extends JpaRepository<SeatExchangeRequest, Long> {
    List<SeatExchangeRequest> findByRequesterBookingPassengerId(Long passengerId);
    List<SeatExchangeRequest> findByTargetSeatFlightIdAndStatus(Long flightId, String status);
}

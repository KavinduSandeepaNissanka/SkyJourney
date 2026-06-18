package com.skyjourney.backend.repository;

import com.skyjourney.backend.model.Baggage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BaggageRepository extends JpaRepository<Baggage, Long> {
    List<Baggage> findByBookingId(Long bookingId);
    Optional<Baggage> findByTagNo(String tagNo);
}

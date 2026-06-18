package com.skyjourney.backend.repository;

import com.skyjourney.backend.model.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, String> {
    Optional<ChatSession> findByPassengerId(Long passengerId);
    Optional<ChatSession> findByPassengerIdAndFlightId(Long passengerId, Long flightId);
}

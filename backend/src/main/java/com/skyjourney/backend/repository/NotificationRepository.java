package com.skyjourney.backend.repository;

import com.skyjourney.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByPassengerIdOrderByCreatedAtDesc(Long passengerId);
    List<Notification> findByPassengerIdAndReadFalse(Long passengerId);
}

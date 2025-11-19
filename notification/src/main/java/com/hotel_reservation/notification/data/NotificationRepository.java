package com.hotel_reservation.notification.data;

import com.hotel_reservation.notification.data.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    List<Notification> findByUserId(int userId);
}

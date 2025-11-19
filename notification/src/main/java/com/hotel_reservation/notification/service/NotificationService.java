package com.hotel_reservation.notification.service;

import com.hotel_reservation.notification.data.Notification;
import com.hotel_reservation.notification.data.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // Create notification
    public Notification createNotification(Notification n) {
        n.setStatus("Pending");
        n.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(n);
    }

    // Mark as Sent
    public Notification markAsSent(int id) {
        Optional<Notification> opt = notificationRepository.findById(id);
        if (opt.isEmpty()) return null;

        Notification n = opt.get();
        n.setStatus("Sent");
        return notificationRepository.save(n);
    }

    // Get all
    public List<Notification> getAll() {
        return notificationRepository.findAll();
    }

    // Get by ID
    public Optional<Notification> getById(int id) {
        return notificationRepository.findById(id);
    }

    // Get user notifications
    public List<Notification> getByUser(int userId) {
        return notificationRepository.findByUserId(userId);
    }
}

package com.hotel_reservation.notification.controller;

import com.hotel_reservation.notification.data.Notification;
import com.hotel_reservation.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // Create a notification
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Notification n) {
        Notification saved = notificationService.createNotification(n);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "notification", saved
        ));
    }

    // Mark as sent
    @PutMapping("/send/{id}")
    public ResponseEntity<?> markAsSent(@PathVariable int id) {
        Notification updated = notificationService.markAsSent(id);

        if (updated == null) {
            return ResponseEntity.status(404).body(Map.of(
                    "status", "error",
                    "message", "Notification not found"
            ));
        }

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "notification", updated
        ));
    }

    // Get all
    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "data", notificationService.getAll()
        ));
    }

    // Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return notificationService.getById(id)
                .map(n -> ResponseEntity.ok(Map.of(
                        "status", "success",
                        "notification", n
                )))
                .orElse(ResponseEntity.status(404).body(Map.of(
                        "status", "error",
                        "message", "Notification not found"
                )));
    }

    // Get by User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserNotifications(@PathVariable int userId) {
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "data", notificationService.getByUser(userId)
        ));
    }
}

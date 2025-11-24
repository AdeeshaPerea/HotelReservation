package com.hotel_reservation.reservation.controller;

import com.hotel_reservation.reservation.data.Reservation;
import com.hotel_reservation.reservation.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    // Constructor Injection (Recommended)
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // Create reservation
    @PostMapping("/book")
    public ResponseEntity<?> bookRoom(@RequestBody Reservation reservation) {
        Reservation saved = reservationService.createReservation(reservation);
        return ResponseEntity.status(201).body(saved);  // better: 201 CREATED
    }

    // Get all reservations
    @GetMapping("/all")
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    // Get reservation by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getReservationById(@PathVariable int id) {

        Reservation reservation = reservationService.getById(id).orElse(null);

        if (reservation == null) {
            return ResponseEntity.status(404).body("Reservation not found");
        }

        return ResponseEntity.ok(reservation);
    }

    // Get all reservations by User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reservation>> getReservationsByUser(@PathVariable int userId) {
        return ResponseEntity.ok(reservationService.getByUserId(userId));
    }

    // Get all reservations by Room ID
    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<Reservation>> getReservationsByRoom(@PathVariable int roomId) {
        return ResponseEntity.ok(reservationService.getByRoomId(roomId));
    }

    // Cancel reservation
    @PutMapping("/cancel/{id}")
    public ResponseEntity<String> cancelReservation(@PathVariable int id) {

        Reservation cancelled = reservationService.cancelReservation(id);

        if (cancelled == null) {
            return ResponseEntity.status(404).body("Reservation not found");
        }

        return ResponseEntity.ok("Reservation cancelled");
    }
}
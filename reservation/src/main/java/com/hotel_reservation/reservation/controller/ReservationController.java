package com.hotel_reservation.reservation.controller;


import com.hotel_reservation.reservation.data.Reservation;
import com.hotel_reservation.reservation.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/reservation")
public class ReservationController {


    @Autowired
    private ReservationService reservationService;


    // -------------------- CREATE --------------------
    @PostMapping("/create")
    public Reservation createReservation(@RequestBody Reservation reservation) {
        return reservationService.createReservation(reservation);
    }


    // -------------------- UPDATE --------------------
    @PutMapping("/update/{id}")
    public Reservation updateReservation(@PathVariable Long id,
                                         @RequestBody Reservation reservation) {
        return reservationService.updateReservation(id, reservation);
    }


    // -------------------- DELETE --------------------
    @DeleteMapping("/delete/{id}")
    public String deleteReservation(@PathVariable Long id) {
        return reservationService.deleteReservation(id)
                ? "Reservation deleted"
                : "Reservation not found";
    }


    // -------------------- GET BY ID --------------------
    @GetMapping("/{id}")
    public Reservation getById(@PathVariable Long id) {
        return reservationService.getById(id);
    }


    // -------------------- GET ALL --------------------
    @GetMapping("/all")
    public List<Reservation> getAll() {
        return reservationService.getAll();
    }


    // -------------------- GET BY USER --------------------
    @GetMapping("/user/{userId}")
    public List<Reservation> getByUser(@PathVariable Long userId) {
        return reservationService.getByUser(userId);
    }


    // -------------------- GET BY ROOM --------------------
    @GetMapping("/room/{roomId}")
    public List<Reservation> getByRoom(@PathVariable Long roomId) {
        return reservationService.getByRoom(roomId);
    }


    // -------------------- CONFIRM RESERVATION --------------------
    @PutMapping("/confirm/{id}")
    public Reservation confirmReservation(@PathVariable Long id) {
        return reservationService.confirmReservation(id);
    }
}


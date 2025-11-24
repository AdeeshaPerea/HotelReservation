package com.hotel_reservation.reservation.service;

import com.hotel_reservation.reservation.data.Reservation;
import com.hotel_reservation.reservation.data.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    public Reservation createReservation(Reservation r) {
        r.setStatus("confirmed");
        return reservationRepository.save(r);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Optional<Reservation> getById(int id) {
        return reservationRepository.findById(id);
    }

    public List<Reservation> getByUserId(int userId) {
        return reservationRepository.findByUserId(userId);
    }

    public List<Reservation> getByRoomId(int roomId) {
        return reservationRepository.findByRoomId(roomId);
    }

    public Reservation cancelReservation(int id) {
        Optional<Reservation> opt = reservationRepository.findById(id);
        if (opt.isEmpty()) return null;
        Reservation r = opt.get();
        r.setStatus("cancelled");
        return reservationRepository.save(r);
    }
}

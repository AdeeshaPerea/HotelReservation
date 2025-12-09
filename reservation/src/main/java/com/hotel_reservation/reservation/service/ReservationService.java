package com.hotel_reservation.reservation.service;


import com.hotel_reservation.reservation.data.Reservation;
import com.hotel_reservation.reservation.data.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;


@Service
public class ReservationService {


    @Autowired
    private ReservationRepository reservationRepository;


    private final RestTemplate restTemplate = new RestTemplate();


    // URLs of other microservices
    private final String USER_SERVICE_URL = "http://localhost:8001/user/";
    private final String ROOM_SERVICE_URL = "http://localhost:8002/room/";


    // ---------------------------- CREATE RESERVATION ----------------------------
    public Reservation createReservation(Reservation reservation) {


        // 1. Validate User
        Object user = restTemplate.getForObject(USER_SERVICE_URL + reservation.getUserId(), Object.class);
        if (user == null) {
            System.out.println("User not found: " + reservation.getUserId());
            return null;
        }


        // 2. Validate Room
        RoomDTO room = restTemplate.getForObject(ROOM_SERVICE_URL + reservation.getRoomId(), RoomDTO.class);
        if (room == null) {
            System.out.println("Room not found: " + reservation.getRoomId());
            return null;
        }


        // 3. Check room availability
        List<Reservation> overlappingReservations =
                reservationRepository.findByRoomIdAndCheckOutGreaterThanAndCheckInLessThan(
                        reservation.getRoomId(),
                        reservation.getCheckIn(),
                        reservation.getCheckOut()
                );


        if (!overlappingReservations.isEmpty()) {
            System.out.println("Room is already booked for selected dates.");
            return null;
        }


        // 4. Calculate nights
        long nights = ChronoUnit.DAYS.between(reservation.getCheckIn(), reservation.getCheckOut());
        if (nights <= 0) {
            System.out.println("Invalid date range.");
            return null;
        }


        reservation.setNights((int) nights);


        // 5. Calculate total price
        reservation.setTotalPrice(room.price * nights);


        // 6. Set status -> PENDING (waiting for payment)
        reservation.setStatus("PENDING");


        // 7. Save in database
        return reservationRepository.save(reservation);
    }


    // ---------------------------- UPDATE ----------------------------
    public Reservation updateReservation(Long id, Reservation data) {
        Reservation existing = reservationRepository.findById(id).orElse(null);
        if (existing == null) return null;


        existing.setUserId(data.getUserId());
        existing.setRoomId(data.getRoomId());
        existing.setCheckIn(data.getCheckIn());
        existing.setCheckOut(data.getCheckOut());
        existing.setStatus(data.getStatus());


        long nights = ChronoUnit.DAYS.between(data.getCheckIn(), data.getCheckOut());
        if (nights <= 0) {
            System.out.println("Invalid date range.");
            return null;
        }


        existing.setNights((int) nights);


        RoomDTO room = restTemplate.getForObject(ROOM_SERVICE_URL + data.getRoomId(), RoomDTO.class);
        existing.setTotalPrice(room.price * nights);


        return reservationRepository.save(existing);
    }


    // ---------------------------- DELETE ----------------------------
    public boolean deleteReservation(Long id) {
        if (reservationRepository.existsById(id)) {
            reservationRepository.deleteById(id);
            return true;
        }
        return false;
    }


    // ---------------------------- GET BY ID ----------------------------
    public Reservation getById(Long id) {
        return reservationRepository.findById(id).orElse(null);
    }


    // ---------------------------- GET ALL ----------------------------
    public List<Reservation> getAll() {
        return reservationRepository.findAll();
    }


    // ---------------------------- GET BY USER ----------------------------
    public List<Reservation> getByUser(Long userId) {
        return reservationRepository.findByUserId(userId);
    }


    // ---------------------------- GET BY ROOM ----------------------------
    public List<Reservation> getByRoom(Long roomId) {
        return reservationRepository.findByRoomId(roomId);
    }


    // ---------------------------- CONFIRM RESERVATION ----------------------------
    public Reservation confirmReservation(Long id) {
        Optional<Reservation> optional = reservationRepository.findById(id);
        if (optional.isEmpty()) return null;


        Reservation reservation = optional.get();
        reservation.setStatus("CONFIRMED");
        return reservationRepository.save(reservation);
    }


    // ==================== RoomDTO (mapping response) ====================
    static class RoomDTO {
        public Long id;
        public double price;
        public String type;
        public String status;
        public String roomNumber;
        public String description;
    }
}


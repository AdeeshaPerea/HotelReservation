package com.hotel_reservation.reservation.data;

import com.hotel_reservation.reservation.data.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    List<Reservation> findByUserId(int userId);
    List<Reservation> findByRoomId(int roomId);
}

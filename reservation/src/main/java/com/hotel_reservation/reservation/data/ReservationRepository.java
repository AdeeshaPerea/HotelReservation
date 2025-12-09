package com.hotel_reservation.reservation.data;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {


    // find all reservations by user
    java.util.List<Reservation> findByUserId(Long userId);


    // find all reservations for a specific room
    java.util.List<Reservation> findByRoomId(Long roomId);


    // find all reservations where room is booked during overlapping dates
    java.util.List<Reservation> findByRoomIdAndCheckOutGreaterThanAndCheckInLessThan(
            Long roomId,
            java.time.LocalDate checkIn,
            java.time.LocalDate checkOut
    );
}


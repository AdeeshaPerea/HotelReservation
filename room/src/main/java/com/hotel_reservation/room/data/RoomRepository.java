package com.hotel_reservation.room.data;

import com.hotel_reservation.room.data.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Integer> {
    List<Room> findByStatus(String status);
}

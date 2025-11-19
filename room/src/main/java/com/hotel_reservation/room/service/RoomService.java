package com.hotel_reservation.room.service;

import com.hotel_reservation.room.data.Room;
import com.hotel_reservation.room.data.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public List<Room> getAvailableRooms() {
        return roomRepository.findByStatus("available");
    }

    public Room updateRoom(int id, Room updatedRoom) {
        Room room = roomRepository.findById(id).orElse(null);
        if (room == null) return null;

        room.setRoomType(updatedRoom.getRoomType());
        room.setPrice(updatedRoom.getPrice());
        room.setStatus(updatedRoom.getStatus());
        room.setDescription(updatedRoom.getDescription());

        return roomRepository.save(room);
    }

    public boolean deleteRoom(int id) {
        roomRepository.deleteById(id);
        return true;
    }
}

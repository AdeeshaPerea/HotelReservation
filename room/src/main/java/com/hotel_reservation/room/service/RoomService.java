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

    // CREATE
    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    // UPDATE
    public Room updateRoom(Long id, Room roomDetails) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id " + id));

        room.setType(roomDetails.getType());
        room.setPrice(roomDetails.getPrice());
        room.setStatus(roomDetails.getStatus());
        room.setDescription(roomDetails.getDescription());
        room.setMaxGuests(roomDetails.getMaxGuests());
        room.setImages(roomDetails.getImages());
        room.setRoomNumber(roomDetails.getRoomNumber());

        return roomRepository.save(room);
    }

    // DELETE
    public boolean deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            return false;
        }
        roomRepository.deleteById(id);
        return true;
    }

    // GET BY ID
    public Room getRoomById(Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    // GET ALL
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
}

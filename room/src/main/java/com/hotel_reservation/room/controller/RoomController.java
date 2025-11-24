package com.hotel_reservation.room.controller;

import com.hotel_reservation.room.data.Room;
import com.hotel_reservation.room.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/rooms")
@CrossOrigin(origins = "http://localhost:3000")
public class RoomController {


    @Autowired
    private RoomService roomService;

    // 🟢 Add room
    @PostMapping("/add")
    public ResponseEntity<?> addRoom(@RequestBody Room room) {
        return ResponseEntity.ok(roomService.addRoom(room));
    }

    // 🟢 Get all rooms
    @GetMapping("/all")
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    // 🟢 Get only available rooms
    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms() {
        return ResponseEntity.ok(roomService.getAvailableRooms());
    }

    // 🟢 Update room
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable int id, @RequestBody Room updatedRoom) {
        Room room = roomService.updateRoom(id, updatedRoom);

        if (room == null) {
            return ResponseEntity.status(404).body("Room not found");
        }
        return ResponseEntity.ok("Room updated successfully");
    }

    // 🟢 Delete room
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable int id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok("Room deleted successfully");
    }
}

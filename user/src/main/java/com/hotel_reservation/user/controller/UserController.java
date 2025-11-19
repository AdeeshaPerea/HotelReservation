package com.hotel_reservation.user.controller;

import com.hotel_reservation.user.data.User;
import com.hotel_reservation.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")   // <-- ADD THIS
public class UserController {

    @Autowired
    private UserService userService;

    // Register User
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User savedUser = userService.register(user);
        return ResponseEntity.ok(savedUser);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {
        User user = userService.login(loginUser.getEmail(), loginUser.getPassword());

        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    // Forgot Password
    @PutMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");

        User user = userService.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(404).body("Email not found");
        }

        userService.updatePassword(user, newPassword);
        return ResponseEntity.ok("Password updated successfully");
    }
}

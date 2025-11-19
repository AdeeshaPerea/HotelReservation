package com.hotel_reservation.user.service;

import com.hotel_reservation.user.data.User;
import com.hotel_reservation.user.data.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User register(User user) {
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User updatePassword(User user, String newPassword) {
        user.setPassword(newPassword);
        return userRepository.save(user);
    }
}
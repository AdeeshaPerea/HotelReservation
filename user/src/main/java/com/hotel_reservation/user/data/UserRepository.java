package com.hotel_reservation.user.data;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hotel_reservation.user.data.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmailAndPassword(String email, String password);
    User findByEmail(String email);
}

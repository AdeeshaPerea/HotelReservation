package com.hotel_reservation.user.data;


import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);   // <-- ADD THIS
}


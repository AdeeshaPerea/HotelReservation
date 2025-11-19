package com.hotel_reservation.payment.data;

import com.hotel_reservation.payment.data.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByReservationId(int reservationId);
}

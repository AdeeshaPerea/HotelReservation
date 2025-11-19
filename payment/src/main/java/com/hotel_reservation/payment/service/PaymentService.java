package com.hotel_reservation.payment.service;

import com.hotel_reservation.payment.data.Payment;
import com.hotel_reservation.payment.data.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    // Create a payment
    public Payment createPayment(Payment payment) {
        payment.setStatus("Pending");
        payment.setPaymentDate(LocalDateTime.now());
        return paymentRepository.save(payment);
    }

    // Update payment status
    public Payment updatePaymentStatus(int id, String status) {
        Optional<Payment> p = paymentRepository.findById(id);
        if (p.isPresent()) {
            Payment payment = p.get();
            payment.setStatus(status);
            return paymentRepository.save(payment);
        }
        return null;
    }

    // Get all payments
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // Get payment by ID
    public Optional<Payment> getPaymentById(int id) {
        return paymentRepository.findById(id);
    }

    // Get payments by Reservation ID
    public List<Payment> getPaymentsByReservation(int reservationId) {
        return paymentRepository.findByReservationId(reservationId);
    }
}

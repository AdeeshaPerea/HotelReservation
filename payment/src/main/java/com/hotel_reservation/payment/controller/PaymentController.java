package com.hotel_reservation.payment.controller;

import com.hotel_reservation.payment.data.Payment;
import com.hotel_reservation.payment.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // Create payment
    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@RequestBody Payment payment) {
        Payment saved = paymentService.createPayment(payment);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("payment", saved);

        return ResponseEntity.ok(response);
    }

    // Update payment status
    @PutMapping("/update-status/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable int id, @RequestParam String status) {
        Payment updated = paymentService.updatePaymentStatus(id, status);

        if (updated == null) {
            return ResponseEntity.status(404).body(Map.of(
                    "status", "error",
                    "message", "Payment not found"
            ));
        }

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "payment", updated
        ));
    }

    // Get all payments
    @GetMapping("/all")
    public ResponseEntity<?> getAllPayments() {
        List<Payment> list = paymentService.getAllPayments();

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "data", list
        ));
    }

    // Get payment by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentById(@PathVariable int id) {

        return paymentService.getPaymentById(id)
                .map(payment -> ResponseEntity.ok(Map.of(
                        "status", "success",
                        "payment", payment
                )))
                .orElse(ResponseEntity.status(404).body(Map.of(
                        "status", "error",
                        "message", "Payment not found"
                )));
    }

    // Get payments based on reservationId
    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<?> getPaymentsByReservation(@PathVariable int reservationId) {
        List<Payment> payments = paymentService.getPaymentsByReservation(reservationId);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "data", payments
        ));
    }
}

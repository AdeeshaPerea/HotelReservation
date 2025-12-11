package com.payment_service.payment.service;

import com.payment_service.payment.data.Payment;
import com.payment_service.payment.data.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    private final String RESERVATION_URL = "http://localhost:8083/reservation/";
    private final String RESERVATION_CONFIRM_URL = RESERVATION_URL + "confirm/";

    // ---------------------- CREATE PAYMENT ----------------------
    public Payment createPayment(Payment incoming) {

        Long resId = incoming.getReservationId();

        // Validate amount
        if (incoming.getAmount() == null || incoming.getAmount() <= 0) {
            incoming.setStatus("FAILED");
            incoming.setCreatedAt(LocalDateTime.now());
            return paymentRepository.save(incoming);
        }

        // 1️⃣ Fetch reservation details
        ReservationDTO reservation;
        try {
            reservation = restTemplate.getForObject(
                    RESERVATION_URL + resId,
                    ReservationDTO.class
            );
            if (reservation == null) {
                incoming.setStatus("FAILED");
                incoming.setCreatedAt(LocalDateTime.now());
                return paymentRepository.save(incoming);
            }
        } catch (Exception e) {
            incoming.setStatus("FAILED");
            incoming.setCreatedAt(LocalDateTime.now());
            return paymentRepository.save(incoming);
        }

        // 2️⃣ BLOCK: reservation already paid
        if ("CONFIRMED".equalsIgnoreCase(reservation.status)) {
            incoming.setStatus("FAILED");
            incoming.setCreatedAt(LocalDateTime.now());
            return paymentRepository.save(incoming);
        }

        // 3️⃣ BLOCK: there is already a successful payment
        Payment existingSuccess = paymentRepository
                .findByReservationIdAndStatus(resId, "SUCCESS");

        if (existingSuccess != null) {
            incoming.setStatus("FAILED");
            incoming.setCreatedAt(LocalDateTime.now());
            return paymentRepository.save(incoming);
        }

        // 4️⃣ Validate method
        if (incoming.getMethod() == null || incoming.getMethod().isEmpty()) {
            incoming.setMethod("CARD");
        }

        // 5️⃣ Set status and save
        incoming.setStatus("PENDING");
        incoming.setCreatedAt(LocalDateTime.now());

        Payment saved = paymentRepository.save(incoming);

        // 6️⃣ Process asynchronously
        processPaymentAsync(saved);

        return saved;
    }

    // ---------------------- ASYNC PAYMENT PROCESSING ----------------------
    @Async
    public void processPaymentAsync(Payment payment) {
        try {
            Thread.sleep(2000); // simulate payment processing

            payment.setStatus("SUCCESS");
            paymentRepository.save(payment);

            // Confirm reservation
            restTemplate.put(RESERVATION_CONFIRM_URL + payment.getReservationId(), null);

        } catch (Exception e) {
            payment.setStatus("FAILED");
            paymentRepository.save(payment);
        }
    }

    // ---------------------- CHECK PAYMENT STATUS ----------------------
    public Payment getPaymentStatus(Long id) {
        return paymentRepository.findById(id).orElse(null);
    }

    // ---------------------- GET ALL PAYMENTS ----------------------
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // DTO for reservation service
    static class ReservationDTO {
        public Long id;
        public Long userId;
        public Long roomId;
        public String status;
        public Double totalPrice;
    }
}

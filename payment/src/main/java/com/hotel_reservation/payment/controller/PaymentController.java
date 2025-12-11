package com.payment_service.payment.controller;

import com.payment_service.payment.data.Payment;
import com.payment_service.payment.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment")
@CrossOrigin("*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create")
    public Payment createPayment(@RequestBody Payment payment) {
        return paymentService.createPayment(payment);
    }

    @GetMapping("/status/{id}")
    public Payment getStatus(@PathVariable Long id) {
        return paymentService.getPaymentStatus(id);
    }

    @GetMapping("/all")
    public List<Payment> getAll() {
        return paymentService.getAllPayments();
    }
}

package com.hotel_reservation.reservation.data;


import jakarta.persistence.*;
import java.time.LocalDate;


@Entity
@Table(name = "reservations")
public class Reservation {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "user_id")
    private Long userId;


    @Column(name = "room_id")
    private Long roomId;


    @Column(name = "check_in")
    private LocalDate checkIn;


    @Column(name = "check_out")
    private LocalDate checkOut;


    @Column(name = "total_price")
    private Double totalPrice;


    private String status;    // pending, confirmed, cancelled


    // -------------------- Getters & Setters --------------------


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public Long getUserId() {
        return userId;
    }


    public void setUserId(Long userId) {
        this.userId = userId;
    }


    public Long getRoomId() {
        return roomId;
    }


    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }


    public LocalDate getCheckIn() {
        return checkIn;
    }


    public void setCheckIn(LocalDate checkIn) {
        this.checkIn = checkIn;
    }


    public LocalDate getCheckOut() {
        return checkOut;
    }


    public void setCheckOut(LocalDate checkOut) {
        this.checkOut = checkOut;
    }


    public Double getTotalPrice() {
        return totalPrice;
    }


    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }


    public String getStatus() {
        return status;
    }


    public void setStatus(String status) {
        this.status = status;
    }


    private Integer nights;


    public Integer getNights() {
        return nights;
    }


    public void setNights(Integer nights) {
        this.nights = nights;
    }


}


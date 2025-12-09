package com.hotel_reservation.room.data;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")     // ⬅️ use existing table name
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;       // column: id

    private String type;   // column: type

    private Integer price; // column: price

    private String status; // column: status

    private String description; // column: description

    @Column(name = "max_guests")
    private Integer maxGuests;  // column: max_guests

    private String images;      // column: images

    @Column(name = "room_number")
    private String roomNumber;  // column: room_number

    public Room() {
    }

    // getters & setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getMaxGuests() {
        return maxGuests;
    }

    public void setMaxGuests(Integer maxGuests) {
        this.maxGuests = maxGuests;
    }

    public String getImages() {
        return images;
    }

    public void setImages(String images) {
        this.images = images;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }
}

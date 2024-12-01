package com.example.hotel.booking.entity;

import javax.persistence.*;

@Entity
@Table(name = "room_images")
public class RoomImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "BYTEA")
    private byte[] imageData;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room; // Link back to the Room entity

    // Constructors
    public RoomImage() {}

    public RoomImage(byte[] imageData, Room room) {
        this.imageData = imageData;
        this.room = room;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }
}

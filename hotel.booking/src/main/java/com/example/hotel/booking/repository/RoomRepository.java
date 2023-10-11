package com.example.hotel.booking.repository;

import com.example.hotel.booking.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {
    Room findRoomByNumber(String number);
}

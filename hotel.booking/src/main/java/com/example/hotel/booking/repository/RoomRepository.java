package com.example.hotel.booking.repository;

import com.example.hotel.booking.entity.Room;
import com.example.hotel.booking.enums.RoomStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    Room findRoomByNumber(String number);
    List<Room> findByStatus(RoomStatusEnum status);
    List<Room> findByUserId(Long userId);

}

package com.example.hotel.booking.service;

import com.example.hotel.booking.entity.Room;
import com.example.hotel.booking.enums.RoomStatusEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface RoomService {
    public Room addNewRoom(Room room);
    public Room updateRoom(Room room);
    public Room getRoomById(Long id);
    public List<Room> getRoomList();
    public Page<Room> getRoomListPageable(Pageable pageable);
    public Room getRoomByNumber(String number);
    public List<Room> getRoomByStatus(RoomStatusEnum status);
    public void deleteRoom(Long id);
    public List<Room> getAvailableRooms();
    public List<Room> getAvailableRoomsInFiveHours();
    public List<Room> getAvailableRoomsInOneDay();
    List<Room> getAvailableRoomsInDateRange(LocalDateTime selectedTime);
}

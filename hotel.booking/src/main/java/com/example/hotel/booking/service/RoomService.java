package com.example.hotel.booking.service;

import com.example.hotel.booking.entity.Room;

import java.util.List;

public interface RoomService {
    public Room addNewRoom(Room room);
    public Room updateRoom(Room room);
    public Room getRoomById(Long id);
    public List<Room> getRoomList();
    public Room getRoomByNumber(String number);
    public void deleteRoom(Long id);
}

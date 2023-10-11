package com.example.hotel.booking.service.impl;

import com.example.hotel.booking.entity.Room;
import com.example.hotel.booking.repository.RoomRepository;
import com.example.hotel.booking.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Qualifier("roomService")
public class RoomServiceImpl implements RoomService {
    private RoomRepository roomRepository;

    @Autowired
    public RoomServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public Room addNewRoom(Room room) {
        Room newRoom = new Room();
        Optional.ofNullable(room.getNumber()).ifPresent(newRoom::setNumber);
        Optional.ofNullable(room.getName()).ifPresent(newRoom::setName);
        Optional.ofNullable(room.getStatus()).ifPresent(newRoom::setStatus);
        Optional.ofNullable(room.getDescription()).ifPresent(newRoom::setDescription);
        Optional.ofNullable(room.getMaxCapacity()).ifPresent(newRoom::setMaxCapacity);
        roomRepository.save(newRoom);
        return newRoom;
    }

    @Override
    public Room getRoomById(Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    @Override
    public List<Room> getRoomList() {
        return roomRepository.findAll();
    }

    @Override
    public Room getRoomByNumber(String number) {
        return roomRepository.findRoomByNumber(number);
    }

    @Override
    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
}

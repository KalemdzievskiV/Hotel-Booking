package com.example.hotel.booking.service.impl;

import com.example.hotel.booking.entity.Room;
import com.example.hotel.booking.enums.RoomStatusEnum;
import com.example.hotel.booking.repository.ReservationRepository;
import com.example.hotel.booking.repository.RoomRepository;
import com.example.hotel.booking.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
@Qualifier("roomService")
public class RoomServiceImpl implements RoomService {
    private final ReservationRepository reservationRepository;
    private RoomRepository roomRepository;

    @Autowired
    public RoomServiceImpl(RoomRepository roomRepository, ReservationRepository reservationRepository) {
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
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
    public Room updateRoom(Room room) {
        Room newRoom = roomRepository.findById(room.getId()).orElse(null);
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
    public List<Room> getRoomByStatus(RoomStatusEnum status) {
        return roomRepository.findByStatus(status);
    }

    @Override
    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    @Override
    public List<Room> getAvailableRooms() {
        List<Room> rooms = roomRepository.findAll();
        List<Room> availableRooms = new ArrayList<>();
        for (Room room : rooms){
            if (room.getStatus().equals(RoomStatusEnum.AVAILABLE)){
                availableRooms.add(room);
            }
        }
        return availableRooms;
    }

    @Override
    public List<Room> getAvailableRoomsInFiveHours(){
        List<Room> rooms = roomRepository.findAll();
        LocalDateTime selectedTime = LocalDateTime.now();
        LocalDateTime selectedTimePlus5Hours = selectedTime.plusHours(5);
        List<Room> roomsToRemove = new ArrayList<>();
        for (Room room : rooms){
            reservationRepository.findReservationsByRoomId(room.getId()).forEach(reservation -> {
                if (reservation.getStart().isBefore(selectedTimePlus5Hours) && reservation.getFinish().isAfter(selectedTime)){
                    roomsToRemove.add(room);
                }
            });

        }
        rooms.removeAll(roomsToRemove);
        return rooms;
    }

    @Override
    public List<Room> getAvailableRoomsInOneDay(){
        List<Room> rooms = roomRepository.findAll();
        LocalDateTime selectedTime = LocalDateTime.now();
        LocalDateTime selectedTimePlus24Hours = selectedTime.plusHours(24);
        List<Room> roomsToRemove = new ArrayList<>();
        for (Room room : rooms){
            reservationRepository.findReservationsByRoomId(room.getId()).forEach(reservation -> {
                if (reservation.getStart().isBefore(selectedTimePlus24Hours) && reservation.getFinish().isAfter(selectedTime)){
                    roomsToRemove.add(room);
                }
            });

        }
        rooms.removeAll(roomsToRemove);
        return rooms;
    }

    @Override
    public List<Room> getAvailableRoomsInDateRange(LocalDateTime selectedTime){
        List<Room> rooms = roomRepository.findAll();
        LocalDateTime selectedTimePlus5Hours = selectedTime.plusHours(5);
        List<Room> roomsToRemove = new ArrayList<>();
        for (Room room : rooms){
            reservationRepository.findReservationsByRoomId(room.getId()).forEach(reservation -> {
                if (reservation.getStart().isBefore(selectedTimePlus5Hours) && reservation.getFinish().isAfter(selectedTime)){
                    roomsToRemove.add(room);
                }
            });

        }
        rooms.removeAll(roomsToRemove);
        return rooms;
    }
}

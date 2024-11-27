package com.example.hotel.booking.service.impl;

import com.example.hotel.booking.entity.Room;
import com.example.hotel.booking.entity.User;
import com.example.hotel.booking.enums.RoomStatusEnum;
import com.example.hotel.booking.repository.ReservationRepository;
import com.example.hotel.booking.repository.RoomRepository;
import com.example.hotel.booking.repository.UserRepository;
import com.example.hotel.booking.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
@Qualifier("roomService")
public class RoomServiceImpl implements RoomService {
    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Autowired
    public RoomServiceImpl(RoomRepository roomRepository, ReservationRepository reservationRepository, UserRepository userRepository) {
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Room addNewRoom(Room room) {
        Room newRoom = new Room();
        Optional.ofNullable(room.getNumber()).ifPresent(newRoom::setNumber);
        Optional.ofNullable(room.getName()).ifPresent(newRoom::setName);
        Optional.ofNullable(room.getStatus()).ifPresent(newRoom::setStatus);
        Optional.ofNullable(room.getDescription()).ifPresent(newRoom::setDescription);
        Optional.ofNullable(room.getMaxCapacity()).ifPresent(newRoom::setMaxCapacity);
        
        if (room.getUser() != null && room.getUser().getId() != null) {
            User user = userRepository.findById(room.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            user.addRoom(newRoom);
        }
        
        return roomRepository.save(newRoom);
    }

    @Override
    public Room updateRoom(Room room) {
        Room existingRoom = roomRepository.findById(room.getId())
            .orElseThrow(() -> new RuntimeException("Room not found"));
            
        Optional.ofNullable(room.getNumber()).ifPresent(existingRoom::setNumber);
        Optional.ofNullable(room.getName()).ifPresent(existingRoom::setName);
        Optional.ofNullable(room.getStatus()).ifPresent(existingRoom::setStatus);
        Optional.ofNullable(room.getDescription()).ifPresent(existingRoom::setDescription);
        Optional.ofNullable(room.getMaxCapacity()).ifPresent(existingRoom::setMaxCapacity);
        
        // Handle user change
        if (room.getUser() != null && room.getUser().getId() != null) {
            User newUser = userRepository.findById(room.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
                
            // Remove from old user if exists
            if (existingRoom.getUser() != null) {
                existingRoom.getUser().removeRoom(existingRoom);
            }
            
            // Add to new user
            newUser.addRoom(existingRoom);
        } else if (room.getUser() == null && existingRoom.getUser() != null) {
            // Remove room from user if user is set to null
            existingRoom.getUser().removeRoom(existingRoom);
        }
        
        return roomRepository.save(existingRoom);
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
    public Page<Room> getRoomListPageable(Pageable pageable) {
        return roomRepository.findAll(pageable);
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

package com.example.hotel.booking.controller;

import com.example.hotel.booking.entity.Room;
import com.example.hotel.booking.enums.RoomStatusEnum;
import com.example.hotel.booking.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping(path = "/room")
public class RoomController {
    private static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    private RoomService roomService;

    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }
    @PostMapping("/add")
    public ResponseEntity<Room> addNewRoom(@RequestBody Room room) {
        return new ResponseEntity<>(roomService.addNewRoom(room), HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<Room> updateRoom(@RequestBody Room room) {
        return new ResponseEntity<>(roomService.updateRoom(room), HttpStatus.OK);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable("id") Long id) {
        Room room = roomService.getRoomById(id);
        return new ResponseEntity<>(room, HttpStatus.OK);
    }

    @GetMapping("/find/status/{status}")
    public ResponseEntity<List<Room>> getRoomByStatus(@PathVariable("status") RoomStatusEnum status) {
        List<Room> rooms = roomService.getRoomByStatus(status);
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }

    @GetMapping("/list")
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomService.getRoomList();
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }

    @GetMapping("/pageable")
    public ResponseEntity<Page<Room>> getRoomsPageable(Pageable pageable) {
        Page<Room> rooms = roomService.getRoomListPageable(pageable);
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }

    @GetMapping("/find//number/{number}")
    public ResponseEntity<Room> getRoomByNumber(@PathVariable("number") String number) {
        Room room = roomService.getRoomByNumber(number);
        return new ResponseEntity<>(room, HttpStatus.OK);
    }

    @GetMapping("/find/available")
    public ResponseEntity<List<Room>> getAvailableRooms() {
        List<Room> rooms = roomService.getAvailableRooms();
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }

    @GetMapping("/find/available/five-hours")
    public ResponseEntity<List<Room>> getAvailableRoomsInFiveHours() {
        List<Room> rooms = roomService.getAvailableRoomsInFiveHours();
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }

    @GetMapping("/find/available/one-day")
    public ResponseEntity<List<Room>> getAvailableRoomsInOneDay() {
        List<Room> rooms = roomService.getAvailableRoomsInOneDay();
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }

    @GetMapping("/find/available/{selectedTime}")
    public ResponseEntity<List<Room>> getAvailableRoomsInDateRange(@PathVariable("selectedTime") String selectedTime) {
        List<Room> rooms = roomService.getAvailableRoomsInDateRange(LocalDateTime.parse(selectedTime, formatter));
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }

    @GetMapping("/find/user/{userId}")
    public ResponseEntity<List<Room>> ListRoomByUser(@PathVariable("userId") Long userId) {
        List<Room> rooms = roomService.getRoomListByUser(userId);
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteRoom(@PathVariable("id") Long id) {
        roomService.deleteRoom(id);
    }
}

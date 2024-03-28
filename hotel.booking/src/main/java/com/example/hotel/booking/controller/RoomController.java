package com.example.hotel.booking.controller;

import com.example.hotel.booking.entity.Room;
import com.example.hotel.booking.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/room")
public class RoomController {
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

    @GetMapping("/list")
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomService.getRoomList();
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }

    @GetMapping("/find/{number}")
    public ResponseEntity<Room> getRoomByNumber(@PathVariable("number") String number) {
        Room room = roomService.getRoomByNumber(number);
        return new ResponseEntity<>(room, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteRoom(@PathVariable("id") Long id) {
        roomService.deleteRoom(id);
    }
}

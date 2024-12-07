package com.example.hotel_management.controller;

import com.example.hotel_management.entity.Room;
import com.example.hotel_management.enums.RoomStatus;
import com.example.hotel_management.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomService roomService;

    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping(consumes = {
        MediaType.APPLICATION_JSON_VALUE,
        "application/json;charset=UTF-8"
    }, produces = {
        MediaType.APPLICATION_JSON_VALUE,
        "application/json;charset=UTF-8"
    })
    public ResponseEntity<Room> createRoom(@Valid @RequestBody Room room) {
        return ResponseEntity.ok(roomService.createRoom(room));
    }

    @PutMapping(
        value = "/{id}",
        consumes = {
            MediaType.APPLICATION_JSON_VALUE,
            "application/json;charset=UTF-8"
        }
    )
    public ResponseEntity<Room> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody Room room) {
        return ResponseEntity.ok(roomService.updateRoom(id, room));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoom(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<Room>> getRoomsByHotel(@PathVariable Long hotelId) {
        return ResponseEntity.ok(roomService.getRoomsByHotelId(hotelId));
    }

    @GetMapping("/hotel/{hotelId}/available")
    public ResponseEntity<List<Room>> getAvailableRoomsByHotel(@PathVariable Long hotelId) {
        return ResponseEntity.ok(roomService.getAvailableRoomsByHotel(hotelId));
    }

    @GetMapping("/hotel/{hotelId}/price-range")
    public ResponseEntity<List<Room>> getRoomsByPriceRange(
            @PathVariable Long hotelId,
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        return ResponseEntity.ok(roomService.getRoomsByPriceRange(hotelId, minPrice, maxPrice));
    }

    @GetMapping("/hotel/{hotelId}/available/price-range")
    public ResponseEntity<List<Room>> getAvailableRoomsByPriceRange(
            @PathVariable Long hotelId,
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        return ResponseEntity.ok(roomService.getAvailableRoomsByPriceRange(hotelId, minPrice, maxPrice));
    }

    @GetMapping("/hotel/{hotelId}/available/sorted")
    public ResponseEntity<List<Room>> getAvailableRoomsSortedByPrice(@PathVariable Long hotelId) {
        return ResponseEntity.ok(roomService.getAvailableRoomsSortedByPrice(hotelId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateRoomStatus(
            @PathVariable Long id,
            @RequestParam RoomStatus status) {
        roomService.updateRoomStatus(id, status);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/hotel/{hotelId}/available/count")
    public ResponseEntity<Long> getAvailableRoomCount(@PathVariable Long hotelId) {
        return ResponseEntity.ok(roomService.getAvailableRoomCount(hotelId));
    }
}

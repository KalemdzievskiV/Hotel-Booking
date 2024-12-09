package com.example.hotel_management.controller;

import com.example.hotel_management.dto.RoomDTO;
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
import java.util.Map;
import java.util.stream.Collectors;

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
    public ResponseEntity<RoomDTO> createRoom(@Valid @RequestBody Room room) {
        return ResponseEntity.ok(RoomDTO.fromEntity(roomService.createRoom(room)));
    }

    @PutMapping(
        value = "/{id}",
        consumes = {
            MediaType.APPLICATION_JSON_VALUE,
            "application/json;charset=UTF-8"
        }
    )
    public ResponseEntity<RoomDTO> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody Room room) {
        return ResponseEntity.ok(RoomDTO.fromEntity(roomService.updateRoom(id, room)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDTO> getRoom(@PathVariable Long id) {
        return ResponseEntity.ok(RoomDTO.fromEntity(roomService.getRoomById(id)));
    }

    @GetMapping
    public ResponseEntity<List<RoomDTO>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms().stream()
                .map(RoomDTO::fromEntity)
                .collect(Collectors.toList()));
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<RoomDTO>> getRoomsByHotel(@PathVariable Long hotelId) {
        return ResponseEntity.ok(roomService.getRoomsByHotelId(hotelId).stream()
                .map(RoomDTO::fromEntity)
                .collect(Collectors.toList()));
    }

    @GetMapping("/hotel/{hotelId}/available")
    public ResponseEntity<List<RoomDTO>> getAvailableRoomsByHotel(@PathVariable Long hotelId) {
        return ResponseEntity.ok(roomService.getAvailableRoomsByHotel(hotelId).stream()
                .map(RoomDTO::fromEntity)
                .collect(Collectors.toList()));
    }

    @GetMapping("/hotel/{hotelId}/price-range")
    public ResponseEntity<List<RoomDTO>> getRoomsByPriceRange(
            @PathVariable Long hotelId,
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        return ResponseEntity.ok(roomService.getRoomsByPriceRange(hotelId, minPrice, maxPrice).stream()
                .map(RoomDTO::fromEntity)
                .collect(Collectors.toList()));
    }

    @GetMapping("/hotel/{hotelId}/available/price-range")
    public ResponseEntity<List<RoomDTO>> getAvailableRoomsByPriceRange(
            @PathVariable Long hotelId,
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        return ResponseEntity.ok(roomService.getAvailableRoomsByPriceRange(hotelId, minPrice, maxPrice).stream()
                .map(RoomDTO::fromEntity)
                .collect(Collectors.toList()));
    }

    @GetMapping("/hotel/{hotelId}/available/sorted")
    public ResponseEntity<List<RoomDTO>> getAvailableRoomsSortedByPrice(@PathVariable Long hotelId) {
        return ResponseEntity.ok(roomService.getAvailableRoomsSortedByPrice(hotelId).stream()
                .map(RoomDTO::fromEntity)
                .collect(Collectors.toList()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Room> updateRoomStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusMap) {
        RoomStatus status = RoomStatus.valueOf(statusMap.get("status"));
        Room updatedRoom = roomService.updateRoomStatus(id, status);
        return ResponseEntity.ok(updatedRoom);
    }

    @PatchMapping("/{id}/status/by-reservation")
    public ResponseEntity<Room> updateRoomStatusByReservation(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusMap) {
        String reservationStatus = statusMap.get("reservationStatus");
        Room updatedRoom = roomService.updateRoomStatusByReservation(id, reservationStatus);
        return ResponseEntity.ok(updatedRoom);
    }

    @GetMapping("/hotel/{hotelId}/available/count")
    public ResponseEntity<Long> getAvailableRoomCount(@PathVariable Long hotelId) {
        return ResponseEntity.ok(roomService.getAvailableRoomCount(hotelId));
    }
}

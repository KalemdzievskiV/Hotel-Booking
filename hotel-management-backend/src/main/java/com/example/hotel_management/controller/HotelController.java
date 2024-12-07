package com.example.hotel_management.controller;

import com.example.hotel_management.dto.HotelDTO;
import com.example.hotel_management.dto.HotelResponseDTO;
import com.example.hotel_management.entity.Hotel;
import com.example.hotel_management.entity.User;
import com.example.hotel_management.service.HotelService;
import com.example.hotel_management.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
@Slf4j
public class HotelController {

    private final HotelService hotelService;
    private final UserService userService;

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUserHotel() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            log.info("Fetching hotel for user with email: {}", userEmail);
            
            User user = userService.getUserByEmail(userEmail);
            log.debug("Found user with ID: {}", user.getId());
            
            HotelResponseDTO hotel = hotelService.getHotelByAdminId(user.getId());
            log.info("Successfully retrieved hotel for user: {}", userEmail);
            
            return ResponseEntity.ok(hotel);
        } catch (EntityNotFoundException e) {
            log.warn("Hotel not found for current user: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error retrieving current user's hotel: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error retrieving hotel information"));
        }
    }

    @PostMapping(
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> createHotel(@Valid @RequestBody HotelDTO hotelDTO) {
        try {
            Hotel hotel = new Hotel();
            hotel.setName(hotelDTO.getName());
            hotel.setAddress(hotelDTO.getAddress());
            hotel.setDescription(hotelDTO.getDescription());
            hotel.setPhoneNumber(hotelDTO.getPhoneNumber());
            hotel.setEmail(hotelDTO.getEmail());
            hotel.setStarRating(hotelDTO.getStarRating());
            hotel.setAmenities(hotelDTO.getAmenities());
            hotel.setPictures(hotelDTO.getPictures());
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            User admin = userService.getUserByEmail(userEmail);
            hotel.setAdmin(admin);
            
            HotelResponseDTO createdHotel = hotelService.createHotel(hotel);
            return ResponseEntity.ok(createdHotel);
        } catch (Exception e) {
            log.error("Error creating hotel: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error creating hotel"));
        }
    }

    @PutMapping(
        value = "/{id}",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> updateHotel(@PathVariable Long id, @Valid @RequestBody HotelDTO hotelDTO) {
        try {
            Hotel hotel = new Hotel();
            hotel.setName(hotelDTO.getName());
            hotel.setAddress(hotelDTO.getAddress());
            hotel.setDescription(hotelDTO.getDescription());
            hotel.setPhoneNumber(hotelDTO.getPhoneNumber());
            hotel.setEmail(hotelDTO.getEmail());
            hotel.setStarRating(hotelDTO.getStarRating());
            hotel.setAmenities(hotelDTO.getAmenities());
            hotel.setPictures(hotelDTO.getPictures());
            
            HotelResponseDTO updatedHotel = hotelService.updateHotel(id, hotel);
            return ResponseEntity.ok(updatedHotel);
        } catch (EntityNotFoundException e) {
            log.warn("Hotel not found with id {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error updating hotel: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error updating hotel"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getHotel(@PathVariable Long id) {
        try {
            HotelResponseDTO hotel = hotelService.getHotelById(id);
            return ResponseEntity.ok(hotel);
        } catch (EntityNotFoundException e) {
            log.warn("Hotel not found with id {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error retrieving hotel: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error retrieving hotel"));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllHotels() {
        try {
            log.debug("Fetching all hotels");
            List<HotelResponseDTO> hotels = hotelService.getAllHotels();
            log.debug("Found {} hotels", hotels.size());
            return ResponseEntity.ok(hotels);
        } catch (Exception e) {
            log.error("Error retrieving all hotels: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error retrieving hotels"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHotel(@PathVariable Long id) {
        try {
            hotelService.deleteHotel(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            log.warn("Hotel not found with id {} for deletion: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error deleting hotel: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error deleting hotel"));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchHotels(@RequestParam String keyword) {
        try {
            log.debug("Searching hotels with keyword: {}", keyword);
            List<HotelResponseDTO> hotels = hotelService.searchHotels(keyword);
            log.debug("Found {} hotels matching search", hotels.size());
            return ResponseEntity.ok(hotels);
        } catch (Exception e) {
            log.error("Error searching hotels: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error searching hotels"));
        }
    }
}

package com.example.hotel_management.controller;

import com.example.hotel_management.dto.HotelDTO;
import com.example.hotel_management.entity.Hotel;
import com.example.hotel_management.entity.User;
import com.example.hotel_management.service.HotelService;
import com.example.hotel_management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "*")
public class HotelController {

    private final HotelService hotelService;
    private final UserService userService;

    @Autowired
    public HotelController(HotelService hotelService, UserService userService) {
        this.hotelService = hotelService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Hotel> createHotel(@Valid @RequestBody HotelDTO hotelDTO) {
        Hotel hotel = new Hotel();
        hotel.setName(hotelDTO.getName());
        hotel.setAddress(hotelDTO.getAddress());
        hotel.setDescription(hotelDTO.getDescription());
        hotel.setPhoneNumber(hotelDTO.getPhoneNumber());
        hotel.setEmail(hotelDTO.getEmail());
        hotel.setStarRating(hotelDTO.getStarRating());
        hotel.setAmenities(hotelDTO.getAmenities());
        hotel.setPictures(hotelDTO.getPictures());
        hotel.setAverageRating(0.0);
        hotel.setTotalReviews(0);
        
        // Get the admin user
        User admin = userService.getUserById(hotelDTO.getAdmin_id());
        hotel.setAdmin(admin);
        
        return ResponseEntity.ok(hotelService.createHotel(hotel));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hotel> updateHotel(@PathVariable Long id, @Valid @RequestBody HotelDTO hotelDTO) {
        Hotel existingHotel = hotelService.getHotelById(id);
        
        existingHotel.setName(hotelDTO.getName());
        existingHotel.setAddress(hotelDTO.getAddress());
        existingHotel.setDescription(hotelDTO.getDescription());
        existingHotel.setPhoneNumber(hotelDTO.getPhoneNumber());
        existingHotel.setEmail(hotelDTO.getEmail());
        existingHotel.setStarRating(hotelDTO.getStarRating());
        existingHotel.setAmenities(hotelDTO.getAmenities());
        existingHotel.setPictures(hotelDTO.getPictures());
        
        if (hotelDTO.getAdmin_id() != null) {
            User admin = userService.getUserById(hotelDTO.getAdmin_id());
            existingHotel.setAdmin(admin);
        }
        
        return ResponseEntity.ok(hotelService.updateHotel(id, existingHotel));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotel(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelById(id));
    }

    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(hotelService.getAllHotels());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Hotel>> searchHotels(@RequestParam String keyword) {
        return ResponseEntity.ok(hotelService.searchHotels(keyword));
    }
}

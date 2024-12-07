package com.example.hotel_management.service.impl;

import com.example.hotel_management.dto.HotelResponseDTO;
import com.example.hotel_management.entity.Hotel;
import com.example.hotel_management.repository.HotelRepository;
import com.example.hotel_management.service.HotelService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;

    private HotelResponseDTO convertToDTO(Hotel hotel) {
        if (hotel == null) {
            return null;
        }
        
        HotelResponseDTO dto = new HotelResponseDTO();
        dto.setId(hotel.getId());
        dto.setName(hotel.getName());
        dto.setAddress(hotel.getAddress());
        dto.setDescription(hotel.getDescription());
        dto.setPhoneNumber(hotel.getPhoneNumber());
        dto.setEmail(hotel.getEmail());
        dto.setStarRating(hotel.getStarRating());
        dto.setAmenities(hotel.getAmenities());
        dto.setPictures(hotel.getPictures());
        dto.setAverageRating(hotel.getAverageRating());
        dto.setTotalReviews(hotel.getTotalReviews());
        if (hotel.getAdmin() != null) {
            dto.setAdminId(hotel.getAdmin().getId());
            dto.setAdminEmail(hotel.getAdmin().getEmail());
        }
        return dto;
    }

    private void validateHotelData(Hotel hotel) {
        if (hotel.getName() == null || hotel.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Hotel name cannot be empty");
        }
        if (hotel.getEmail() == null || hotel.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Hotel email cannot be empty");
        }
        if (hotel.getStarRating() != null && (hotel.getStarRating() < 1 || hotel.getStarRating() > 5)) {
            throw new IllegalArgumentException("Star rating must be between 1 and 5");
        }
    }

    @Override
    public HotelResponseDTO createHotel(Hotel hotel) {
        if (hotelRepository.existsByEmailIgnoreCase(hotel.getEmail())) {
            throw new IllegalStateException("Hotel with this email already exists");
        }
        
        // Set default values for new hotels
        if (hotel.getAverageRating() == null) hotel.setAverageRating(0.0);
        if (hotel.getTotalReviews() == null) hotel.setTotalReviews(0);
        
        validateHotelData(hotel);
        
        Hotel savedHotel = hotelRepository.save(hotel);
        log.info("Created new hotel with ID: {}", savedHotel.getId());
        return convertToDTO(savedHotel);
    }

    @Override
    @Transactional(readOnly = true)
    public HotelResponseDTO getHotelByAdminId(Long adminId) {
        return hotelRepository.findByAdminId(adminId)
            .stream()
            .findFirst()
            .map(this::convertToDTO)
            .orElseThrow(() -> new EntityNotFoundException("No hotel found for admin with ID: " + adminId));
    }

    @Override
    public HotelResponseDTO updateHotel(Long id, Hotel hotel) {
        Hotel existingHotel = hotelRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Hotel not found with id: " + id));
        
        if (!existingHotel.getEmail().equals(hotel.getEmail()) 
            && hotelRepository.existsByEmailIgnoreCase(hotel.getEmail())) {
            throw new IllegalStateException("Hotel with this email already exists");
        }

        validateHotelData(hotel);
        
        existingHotel.setName(hotel.getName());
        existingHotel.setAddress(hotel.getAddress());
        existingHotel.setDescription(hotel.getDescription());
        existingHotel.setPhoneNumber(hotel.getPhoneNumber());
        existingHotel.setEmail(hotel.getEmail());
        existingHotel.setStarRating(hotel.getStarRating());
        existingHotel.setAmenities(hotel.getAmenities());
        existingHotel.setPictures(hotel.getPictures());
        
        Hotel updatedHotel = hotelRepository.save(existingHotel);
        log.info("Updated hotel with ID: {}", updatedHotel.getId());
        return convertToDTO(updatedHotel);
    }

    @Override
    public void deleteHotel(Long id) {
        if (!hotelRepository.existsById(id)) {
            throw new EntityNotFoundException("Hotel not found with id: " + id);
        }
        hotelRepository.deleteById(id);
        log.info("Deleted hotel with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public HotelResponseDTO getHotelById(Long id) {
        return hotelRepository.findById(id)
            .map(this::convertToDTO)
            .orElseThrow(() -> new EntityNotFoundException("Hotel not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<HotelResponseDTO> getAllHotels() {
        try {
            List<Hotel> hotels = hotelRepository.findAll();
            log.debug("Retrieved {} hotels from database", hotels.size());
            return hotels.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching all hotels: {}", e.getMessage(), e);
            throw new RuntimeException("Error fetching hotels: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<HotelResponseDTO> searchHotels(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllHotels();
        }
        String searchTerm = keyword.trim();
        List<Hotel> hotels = hotelRepository.findByNameContainingIgnoreCaseOrAddressContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            searchTerm, searchTerm, searchTerm);
        log.debug("Found {} hotels matching search term: {}", hotels.size(), searchTerm);
        return hotels.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
}

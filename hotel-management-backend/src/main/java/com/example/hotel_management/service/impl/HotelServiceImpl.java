package com.example.hotel_management.service.impl;

import com.example.hotel_management.entity.Hotel;
import com.example.hotel_management.repository.HotelRepository;
import com.example.hotel_management.service.HotelService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Set;

@Service
@Transactional
@RequiredArgsConstructor
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;

    @Override
    public Hotel createHotel(Hotel hotel) {
        if (hotelRepository.existsByEmailIgnoreCase(hotel.getEmail())) {
            throw new IllegalStateException("Hotel with this email already exists");
        }
        
        // Set default values for new hotels
        if (hotel.getAverageRating() == null) hotel.setAverageRating(0.0);
        if (hotel.getTotalReviews() == null) hotel.setTotalReviews(0);
        
        validateHotelData(hotel);
        return hotelRepository.save(hotel);
    }

    @Override
    public Hotel updateHotel(Long id, Hotel hotel) {
        Hotel existingHotel = getHotelById(id);
        
        // Check email uniqueness if it's being changed
        if (!existingHotel.getEmail().equalsIgnoreCase(hotel.getEmail()) 
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
        
        return hotelRepository.save(existingHotel);
    }

    @Override
    public Hotel getHotelById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Hotel not found with id: " + id));
    }

    @Override
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    @Override
    public List<Hotel> getHotelsByAdminId(Long adminId) {
        return hotelRepository.findByAdminId(adminId);
    }

    @Override
    public void deleteHotel(Long id) {
        if (!hotelRepository.existsById(id)) {
            throw new EntityNotFoundException("Hotel not found with id: " + id);
        }
        hotelRepository.deleteById(id);
    }

    @Override
    public List<Hotel> searchHotels(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllHotels();
        }
        String searchTerm = keyword.trim();
        return hotelRepository.findByNameContainingIgnoreCaseOrAddressContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            searchTerm, searchTerm, searchTerm
        );
    }

    @Override
    public List<Hotel> findByStarRating(Integer starRating) {
        validateStarRating(starRating);
        return hotelRepository.findByStarRating(starRating);
    }

    @Override
    public List<Hotel> findByAverageRatingGreaterThanEqual(Double rating) {
        validateRating(rating);
        return hotelRepository.findByAverageRatingGreaterThanEqual(rating);
    }

    @Override
    public List<Hotel> findByStarRatingAndAverageRating(Integer minStars, Double minRating) {
        validateStarRating(minStars);
        validateRating(minRating);
        return hotelRepository.findByStarRatingAndAverageRating(minStars, minRating);
    }

    @Override
    public List<Hotel> findByAmenity(String amenity) {
        if (amenity == null || amenity.trim().isEmpty()) {
            throw new IllegalArgumentException("Amenity cannot be empty");
        }
        return hotelRepository.findByAmenity(amenity.trim());
    }

    @Override
    public List<Hotel> findTopRatedHotels(Double minRating) {
        validateRating(minRating);
        return hotelRepository.findTopRatedHotels(minRating);
    }

    @Override
    public void updateHotelRating(Long id, Double newRating) {
        validateRating(newRating);
        Hotel hotel = getHotelById(id);
        Double currentTotal = hotel.getAverageRating() * hotel.getTotalReviews();
        hotel.setTotalReviews(hotel.getTotalReviews() + 1);
        hotel.setAverageRating((currentTotal + newRating) / hotel.getTotalReviews());
        hotelRepository.save(hotel);
    }

    private void validateHotelData(Hotel hotel) {
        if (hotel.getName() == null || hotel.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Hotel name cannot be empty");
        }
        if (hotel.getAddress() == null || hotel.getAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("Hotel address cannot be empty");
        }
        if (hotel.getEmail() == null || hotel.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Hotel email cannot be empty");
        }
        if (hotel.getPhoneNumber() == null || hotel.getPhoneNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Hotel phone number cannot be empty");
        }
        validateStarRating(hotel.getStarRating());
    }

    private void validateStarRating(Integer starRating) {
        if (starRating == null || starRating < 1 || starRating > 5) {
            throw new IllegalArgumentException("Star rating must be between 1 and 5");
        }
    }

    private void validateRating(Double rating) {
        if (rating == null || rating < 0 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 0 and 5");
        }
    }
}

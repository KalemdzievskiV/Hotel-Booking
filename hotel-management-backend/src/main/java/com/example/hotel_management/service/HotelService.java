package com.example.hotel_management.service;

import com.example.hotel_management.dto.HotelResponseDTO;
import com.example.hotel_management.entity.Hotel;

import java.util.List;

public interface HotelService {
    /**
     * Creates a new hotel with validation
     * @param hotel Hotel entity to create
     * @return Created hotel
     * @throws IllegalStateException if hotel with same email exists
     * @throws IllegalArgumentException if required fields are missing or invalid
     */
    HotelResponseDTO createHotel(Hotel hotel);

    /**
     * Gets a hotel by admin ID
     * @param adminId Admin user ID
     * @return Hotel managed by admin
     * @throws EntityNotFoundException if no hotel found for admin
     */
    HotelResponseDTO getHotelByAdminId(Long adminId);

    /**
     * Updates an existing hotel
     * @param id Hotel ID to update
     * @param hotel Updated hotel data
     * @return Updated hotel
     * @throws EntityNotFoundException if hotel not found
     * @throws IllegalStateException if email is changed and already exists
     * @throws IllegalArgumentException if required fields are missing or invalid
     */
    HotelResponseDTO updateHotel(Long id, Hotel hotel);

    /**
     * Deletes a hotel by ID
     * @param id Hotel ID to delete
     * @throws EntityNotFoundException if hotel not found
     */
    void deleteHotel(Long id);

    /**
     * Retrieves all hotels
     * @return List of all hotels
     */
    List<HotelResponseDTO> getAllHotels();

    /**
     * Retrieves a hotel by ID
     * @param id Hotel ID
     * @return Hotel entity
     * @throws EntityNotFoundException if hotel not found
     */
    HotelResponseDTO getHotelById(Long id);

    /**
     * Searches hotels by keyword in name, address, or description
     * @param keyword Search term
     * @return List of matching hotels
     */
    List<HotelResponseDTO> searchHotels(String keyword);
}

package com.example.hotel_management.service;

import com.example.hotel_management.entity.Hotel;
import com.example.hotel_management.enums.RoomStatus;
import java.util.List;

public interface HotelService {
    /**
     * Creates a new hotel with validation
     * @param hotel Hotel entity to create
     * @return Created hotel
     * @throws IllegalStateException if hotel with same email exists
     * @throws IllegalArgumentException if required fields are missing or invalid
     */
    Hotel createHotel(Hotel hotel);

    /**
     * Updates an existing hotel
     * @param id Hotel ID to update
     * @param hotel Updated hotel data
     * @return Updated hotel
     * @throws EntityNotFoundException if hotel not found
     * @throws IllegalStateException if email is changed and already exists
     * @throws IllegalArgumentException if required fields are missing or invalid
     */
    Hotel updateHotel(Long id, Hotel hotel);

    /**
     * Retrieves a hotel by ID
     * @param id Hotel ID
     * @return Hotel entity
     * @throws EntityNotFoundException if hotel not found
     */
    Hotel getHotelById(Long id);

    /**
     * Retrieves all hotels
     * @return List of all hotels
     */
    List<Hotel> getAllHotels();

    /**
     * Retrieves hotels managed by specific admin
     * @param adminId Admin user ID
     * @return List of hotels managed by admin
     */
    List<Hotel> getHotelsByAdminId(Long adminId);

    /**
     * Deletes a hotel by ID
     * @param id Hotel ID to delete
     * @throws EntityNotFoundException if hotel not found
     */
    void deleteHotel(Long id);

    /**
     * Searches hotels by keyword in name, address, or description
     * @param keyword Search term
     * @return List of matching hotels
     */
    List<Hotel> searchHotels(String keyword);

    /**
     * Finds hotels by star rating
     * @param starRating Star rating to filter by (1-5)
     * @return List of hotels with specified rating
     * @throws IllegalArgumentException if rating is invalid
     */
    List<Hotel> findByStarRating(Integer starRating);

    /**
     * Finds hotels with average rating greater than or equal to specified value
     * @param rating Minimum average rating
     * @return List of matching hotels
     * @throws IllegalArgumentException if rating is invalid
     */
    List<Hotel> findByAverageRatingGreaterThanEqual(Double rating);

    /**
     * Finds hotels by minimum star rating and average user rating
     * @param minStars Minimum star rating
     * @param minRating Minimum average user rating
     * @return List of matching hotels
     * @throws IllegalArgumentException if ratings are invalid
     */
    List<Hotel> findByStarRatingAndAverageRating(Integer minStars, Double minRating);

    /**
     * Finds hotels by specific amenity
     * @param amenity Amenity to search for
     * @return List of hotels with specified amenity
     * @throws IllegalArgumentException if amenity is null or empty
     */
    List<Hotel> findByAmenity(String amenity);

    /**
     * Finds top rated hotels above specified rating
     * @param minRating Minimum rating threshold
     * @return List of hotels sorted by rating
     * @throws IllegalArgumentException if rating is invalid
     */
    List<Hotel> findTopRatedHotels(Double minRating);

    /**
     * Updates hotel rating with new review
     * @param id Hotel ID
     * @param newRating New rating value (0-5)
     * @throws EntityNotFoundException if hotel not found
     * @throws IllegalArgumentException if rating is invalid
     */
    void updateHotelRating(Long id, Double newRating);
}

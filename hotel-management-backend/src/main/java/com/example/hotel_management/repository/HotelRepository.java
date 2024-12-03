package com.example.hotel_management.repository;

import com.example.hotel_management.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    
    List<Hotel> findByNameContainingIgnoreCaseOrAddressContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String name, String address, String description);
    
    List<Hotel> findByStarRating(Integer starRating);
    
    List<Hotel> findByAverageRatingGreaterThanEqual(Double rating);
    
    List<Hotel> findByAdminId(Long adminId);
    
    @Query("SELECT h FROM Hotel h WHERE h.starRating >= :minStars AND h.averageRating >= :minRating")
    List<Hotel> findByStarRatingAndAverageRating(
            @Param("minStars") Integer minStars, 
            @Param("minRating") Double minRating);
    
    @Query("SELECT h FROM Hotel h WHERE :amenity MEMBER OF h.amenities")
    List<Hotel> findByAmenity(@Param("amenity") String amenity);
    
    @Query("SELECT h FROM Hotel h WHERE h.averageRating >= :rating ORDER BY h.averageRating DESC")
    List<Hotel> findTopRatedHotels(@Param("rating") Double rating);
    
    boolean existsByEmailIgnoreCase(String email);
}

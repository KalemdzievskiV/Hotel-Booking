package com.example.hotel_management.repository;

import com.example.hotel_management.entity.Room;
import com.example.hotel_management.enums.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    @Query("SELECT DISTINCT r FROM Room r " +
           "LEFT JOIN FETCH r.hotel h " +
           "WHERE r.hotel.id = :hotelId")
    List<Room> findByHotelId(@Param("hotelId") Long hotelId);
    
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Room r WHERE r.number = :number AND r.hotel.id = :hotelId")
    boolean existsByNumberAndHotelId(@Param("number") String number, @Param("hotelId") Long hotelId);
    
    List<Room> findByHotelIdAndStatus(Long hotelId, RoomStatus status);
    
    List<Room> findByHotelIdAndPriceLessThanEqual(Long hotelId, BigDecimal maxPrice);
    
    List<Room> findByHotelIdAndPriceBetween(Long hotelId, BigDecimal minPrice, BigDecimal maxPrice);
    
    @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId AND r.status = :status ORDER BY r.price ASC")
    List<Room> findAvailableRoomsSortedByPrice(@Param("hotelId") Long hotelId, @Param("status") RoomStatus status);
    
    @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId AND r.status = :status AND r.price BETWEEN :minPrice AND :maxPrice")
    List<Room> findAvailableRoomsByPriceRange(
            @Param("hotelId") Long hotelId,
            @Param("status") RoomStatus status,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT COUNT(r) FROM Room r WHERE r.hotel.id = :hotelId AND r.status = :status")
    long countByHotelIdAndStatus(@Param("hotelId") Long hotelId, @Param("status") RoomStatus status);
}

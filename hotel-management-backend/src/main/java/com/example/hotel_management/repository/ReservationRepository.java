package com.example.hotel_management.repository;

import com.example.hotel_management.entity.Reservation;
import com.example.hotel_management.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    // Find by guest ID
    List<Reservation> findByGuestId(Long guestId);
    
    // Find by room ID
    List<Reservation> findByRoomId(Long roomId);
    
    // Find by hotel ID
    List<Reservation> findByHotelId(Long hotelId);
    
    // Find upcoming reservations for a guest
    List<Reservation> findByGuestIdAndCheckInTimeAfter(Long guestId, LocalDateTime dateTime);
    
    // Find reservations for a guest within a date range
    @Query("SELECT r FROM Reservation r WHERE r.guest.id = :guestId " +
           "AND :checkTime BETWEEN r.checkInTime AND r.checkOutTime")
    List<Reservation> findByGuestIdAndDateRange(
        @Param("guestId") Long guestId,
        @Param("checkTime") LocalDateTime checkTime
    );
    
    // Find overlapping reservations for a room
    @Query("SELECT r FROM Reservation r WHERE r.room.id = :roomId " +
           "AND r.status IN ('PENDING', 'ACTIVE') " +
           "AND ((r.checkInTime BETWEEN :checkIn AND :checkOut) " +
           "OR (r.checkOutTime BETWEEN :checkIn AND :checkOut) " +
           "OR (:checkIn BETWEEN r.checkInTime AND r.checkOutTime))")
    List<Reservation> findOverlappingReservations(
        @Param("roomId") Long roomId,
        @Param("checkIn") LocalDateTime checkIn,
        @Param("checkOut") LocalDateTime checkOut
    );
    
    // Find all active reservations for a hotel
    List<Reservation> findByHotelIdAndStatus(Long hotelId, ReservationStatus status);
    
    // Find all reservations for a room within a date range
    @Query("SELECT r FROM Reservation r WHERE r.room.id = :roomId " +
           "AND ((r.checkInTime BETWEEN :startDate AND :endDate) " +
           "OR (r.checkOutTime BETWEEN :startDate AND :endDate))")
    List<Reservation> findByRoomIdAndDateRange(
        @Param("roomId") Long roomId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    // Count active reservations for a room
    long countByRoomIdAndStatus(Long roomId, ReservationStatus status);
    
    // Find all reservations by status
    List<Reservation> findByStatus(ReservationStatus status);
}

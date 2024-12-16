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
    
    // Find by hotel ID with all necessary relationships
    @Query("SELECT DISTINCT r FROM Reservation r " +
           "LEFT JOIN FETCH r.room rm " +
           "LEFT JOIN FETCH rm.pictures " +
           "LEFT JOIN FETCH r.guest g " +
           "LEFT JOIN FETCH r.createdBy cb " +
           "LEFT JOIN FETCH r.hotel h " +
           "WHERE r.hotel.id = :hotelId")
    List<Reservation> findByHotelIdWithDetails(@Param("hotelId") Long hotelId);

    // Simple find by hotel ID (when full details aren't needed)
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
    
    // Find reservations that should be checked in
    List<Reservation> findByStatusAndCheckInTimeBefore(ReservationStatus status, LocalDateTime checkTime);
    
    // Find reservations that should be checked out
    List<Reservation> findByStatusAndCheckOutTimeBefore(ReservationStatus status, LocalDateTime checkTime);
    
    // Find current reservations for a guest
    @Query("SELECT r FROM Reservation r " +
           "WHERE r.guest.id = :guestId " +
           "AND r.checkInTime <= :currentTime " +
           "AND r.checkOutTime > :currentTime " +
           "AND r.status = 'CONFIRMED'")
    List<Reservation> findCurrentReservations(@Param("guestId") Long guestId, @Param("currentTime") LocalDateTime currentTime);

    // Count reservations by hotel ID
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.room.hotel.id = :hotelId")
    long countByHotelId(Long hotelId);

    // Find active reservations for a hotel
    @Query("SELECT r FROM Reservation r WHERE r.room.hotel.id = :hotelId " +
           "AND r.checkInTime <= :now AND r.checkOutTime >= :now " +
           "AND r.status = 'ACTIVE'")
    List<Reservation> findActiveReservations(Long hotelId, LocalDateTime now);

    // Find reservations for a hotel ordered by creation time
    @Query("SELECT r FROM Reservation r WHERE r.room.hotel.id = :hotelId " +
           "ORDER BY r.createdAt DESC")
    List<Reservation> findByHotelIdOrderByCreatedAtDesc(Long hotelId);

    // Calculate revenue for a hotel within a date range
    @Query("SELECT COALESCE(SUM(r.totalPrice), 0) FROM Reservation r " +
           "WHERE r.room.hotel.id = :hotelId " +
           "AND r.createdAt BETWEEN :startDate AND :endDate")
    Double calculateRevenueForPeriod(Long hotelId, LocalDateTime startDate, LocalDateTime endDate);

    // Find upcoming checkouts for a hotel
    @Query("SELECT r FROM Reservation r WHERE r.room.hotel.id = :hotelId " +
           "AND r.checkOutTime > :now " +
           "ORDER BY r.checkOutTime ASC")
    List<Reservation> findUpcomingCheckouts(Long hotelId, LocalDateTime now);
}

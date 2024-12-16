package com.example.hotel_management.service;

import com.example.hotel_management.dto.ReservationDTO;
import com.example.hotel_management.dto.HotelStatsDTO;
import com.example.hotel_management.entity.Reservation;
import com.example.hotel_management.enums.ReservationStatus;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service interface for managing hotel reservations.
 * Provides methods for creating, updating, retrieving, and managing reservation status.
 */
public interface ReservationService {
    
    /**
     * Creates a new reservation.
     * Validates dates, calculates total price, and checks room availability.
     *
     * @param reservation The reservation to create
     * @return The created reservation with generated ID and calculated price
     * @throws IllegalArgumentException if reservation dates are invalid
     * @throws IllegalStateException if the room is not available
     */
    ReservationDTO createReservation(Reservation reservation);

    /**
     * Updates an existing reservation.
     * Recalculates price if dates change and validates new data.
     *
     * @param id The ID of the reservation to update
     * @param reservation The updated reservation data
     * @return The updated reservation
     * @throws EntityNotFoundException if reservation not found
     * @throws IllegalArgumentException if updated dates are invalid
     * @throws IllegalStateException if the room is not available for new dates
     */
    ReservationDTO updateReservation(Long id, Reservation reservation);

    /**
     * Retrieves a reservation by its ID.
     *
     * @param id The ID of the reservation
     * @return The reservation
     * @throws EntityNotFoundException if reservation not found
     */
    ReservationDTO getReservationById(Long id);

    /**
     * Retrieves all reservations in the system.
     *
     * @return List of all reservations
     */
    List<ReservationDTO> getAllReservations();

    /**
     * Retrieves all reservations for a specific guest.
     *
     * @param guestId The ID of the guest
     * @return List of reservations for the guest
     */
    List<ReservationDTO> getReservationsByUserId(Long guestId);

    /**
     * Retrieves all reservations for a specific hotel.
     *
     * @param hotelId The ID of the hotel
     * @return List of reservations for the hotel
     */
    List<ReservationDTO> getReservationsByHotelId(Long hotelId);

    /**
     * Retrieves upcoming reservations for a guest.
     * Only returns reservations with check-in time after current time.
     *
     * @param guestId The ID of the guest
     * @return List of upcoming reservations
     */
    List<ReservationDTO> getUpcomingReservations(Long guestId);

    /**
     * Retrieves current active reservations for a guest.
     * Returns reservations where current time is between check-in and check-out.
     *
     * @param guestId The ID of the guest
     * @return List of current reservations
     */
    List<ReservationDTO> getCurrentReservations(Long guestId);

    /**
     * Updates the status of a reservation based on its check-in and check-out times.
     * Changes status to CHECKED_IN if check-in time has passed and status is CONFIRMED.
     * Changes status to CHECKED_OUT if check-out time has passed and status is CHECKED_IN.
     *
     * @param id The ID of the reservation to update
     */
    void updateReservationStatusBasedOnTime(Long id);

    /**
     * Updates the status of all reservations based on their check-in and check-out times.
     * This method is scheduled to run periodically.
     */
    void updateReservationStatuses();

    /**
     * Cancels a reservation.
     * Sets the reservation status to CANCELLED.
     *
     * @param id The ID of the reservation to cancel
     * @throws EntityNotFoundException if reservation not found
     * @throws IllegalStateException if reservation is already cancelled
     */
    void cancelReservation(Long id);

    boolean isRoomAvailable(Long roomId, LocalDateTime checkIn, LocalDateTime checkOut);

    @Transactional
    ReservationDTO updateReservationStatus(Long id, ReservationStatus status);

    /**
     * Get comprehensive statistics for a specific hotel
     *
     * @param hotelId The ID of the hotel
     * @return HotelStatsDTO containing various statistics
     */
    HotelStatsDTO getHotelStats(Long hotelId);
}

package com.example.hotel_management.service.impl;

import com.example.hotel_management.entity.Reservation;
import com.example.hotel_management.entity.Room;
import com.example.hotel_management.enums.ReservationStatus;
import com.example.hotel_management.repository.ReservationRepository;
import com.example.hotel_management.repository.RoomRepository;
import com.example.hotel_management.service.ReservationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.math.BigDecimal;

@Service
@Transactional
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;

    @Override
    public Reservation createReservation(Reservation reservation) {
        validateReservation(reservation);
        
        Room room = roomRepository.findById(reservation.getRoom().getId())
            .orElseThrow(() -> new EntityNotFoundException("Room not found"));
            
        if (!isRoomAvailable(room.getId(), reservation.getCheckInTime(), reservation.getCheckOutTime())) {
            throw new IllegalStateException("Room is not available for the selected dates");
        }

        // Calculate total price based on room rate and duration
        long days = ChronoUnit.DAYS.between(reservation.getCheckInTime(), reservation.getCheckOutTime());
        if (days < 1) days = 1; // Minimum one day charge
        reservation.setTotalPrice(room.getPrice().multiply(BigDecimal.valueOf(days)));
        
        // Set initial status and hotel
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setHotel(room.getHotel());
        
        return reservationRepository.save(reservation);
    }

    @Override
    public Reservation updateReservation(Long id, Reservation updatedReservation) {
        Reservation existingReservation = getReservationById(id);
        
        validateReservation(updatedReservation);
        
        // If dates are being changed, check availability
        if (!existingReservation.getCheckInTime().equals(updatedReservation.getCheckInTime()) 
            || !existingReservation.getCheckOutTime().equals(updatedReservation.getCheckOutTime())) {
            if (!isRoomAvailable(existingReservation.getRoom().getId(), 
                               updatedReservation.getCheckInTime(), 
                               updatedReservation.getCheckOutTime(), 
                               id)) {
                throw new IllegalStateException("Room is not available for the updated dates");
            }
            
            // Recalculate total price if dates changed
            long days = ChronoUnit.DAYS.between(updatedReservation.getCheckInTime(), 
                                              updatedReservation.getCheckOutTime());
            if (days < 1) days = 1; // Minimum one day charge
            existingReservation.setTotalPrice(
                existingReservation.getRoom().getPrice().multiply(BigDecimal.valueOf(days))
            );
        }
        
        // Update fields
        existingReservation.setCheckInTime(updatedReservation.getCheckInTime());
        existingReservation.setCheckOutTime(updatedReservation.getCheckOutTime());
        existingReservation.setSpecialRequests(updatedReservation.getSpecialRequests());
        
        // Only allow certain status transitions
        if (updatedReservation.getStatus() != null) {
            validateStatusTransition(existingReservation.getStatus(), updatedReservation.getStatus());
            existingReservation.setStatus(updatedReservation.getStatus());
        }
        
        return reservationRepository.save(existingReservation);
    }

    @Override
    public void cancelReservation(Long id) {
        Reservation reservation = getReservationById(id);
        
        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new IllegalStateException("Reservation is already cancelled");
        }
        
        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
    }

    @Override
    public boolean isRoomAvailable(Long roomId, LocalDateTime checkIn, LocalDateTime checkOut) {
        return isRoomAvailable(roomId, checkIn, checkOut, null);
    }

    private boolean isRoomAvailable(Long roomId, LocalDateTime checkIn, LocalDateTime checkOut, Long excludeReservationId) {
        List<Reservation> overlappingReservations = reservationRepository
            .findOverlappingReservations(roomId, checkIn, checkOut);
            
        if (excludeReservationId != null) {
            overlappingReservations = overlappingReservations.stream()
                .filter(r -> !r.getId().equals(excludeReservationId))
                .toList();
        }
        
        return overlappingReservations.stream()
            .noneMatch(r -> r.getStatus() == ReservationStatus.PENDING 
                       || r.getStatus() == ReservationStatus.CONFIRMED
                       || r.getStatus() == ReservationStatus.CHECKED_IN);
    }

    private void validateReservation(Reservation reservation) {
        if (reservation.getCheckInTime() == null || reservation.getCheckOutTime() == null) {
            throw new IllegalArgumentException("Check-in and check-out times are required");
        }
        
        if (reservation.getCheckInTime().isAfter(reservation.getCheckOutTime())) {
            throw new IllegalArgumentException("Check-in time must be before check-out time");
        }
        
        if (reservation.getCheckInTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Check-in time cannot be in the past");
        }
        
        // Ensure minimum stay duration
        if (ChronoUnit.HOURS.between(reservation.getCheckInTime(), 
                                   reservation.getCheckOutTime()) < 24) {
            throw new IllegalArgumentException("Minimum stay duration is 1 day");
        }
    }

    private void validateStatusTransition(ReservationStatus currentStatus, ReservationStatus newStatus) {
        if (currentStatus == ReservationStatus.CANCELLED) {
            throw new IllegalStateException("Cannot update a cancelled reservation");
        }
        
        if (currentStatus == ReservationStatus.CHECKED_OUT) {
            throw new IllegalStateException("Cannot update a completed reservation");
        }
        
        // Validate status flow
        switch (currentStatus) {
            case PENDING:
                if (newStatus != ReservationStatus.CONFIRMED && newStatus != ReservationStatus.CANCELLED) {
                    throw new IllegalStateException("Pending reservation can only be confirmed or cancelled");
                }
                break;
            case CONFIRMED:
                if (newStatus != ReservationStatus.CHECKED_IN && newStatus != ReservationStatus.CANCELLED) {
                    throw new IllegalStateException("Confirmed reservation can only be checked in or cancelled");
                }
                break;
            case CHECKED_IN:
                if (newStatus != ReservationStatus.CHECKED_OUT) {
                    throw new IllegalStateException("Checked in reservation can only be checked out");
                }
                break;
            default:
                throw new IllegalStateException("Invalid status transition");
        }
    }

    @Override
    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reservation not found with id: " + id));
    }

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public List<Reservation> getReservationsByUserId(Long guestId) {
        return reservationRepository.findByGuestId(guestId);
    }

    @Override
    public List<Reservation> getReservationsByHotelId(Long hotelId) {
        return reservationRepository.findByHotelId(hotelId);
    }

    @Override
    public List<Reservation> getUpcomingReservations(Long guestId) {
        return reservationRepository.findByGuestIdAndCheckInTimeAfter(guestId, LocalDateTime.now());
    }

    @Override
    public List<Reservation> getCurrentReservations(Long guestId) {
        LocalDateTime now = LocalDateTime.now();
        return reservationRepository.findByGuestIdAndDateRange(guestId, now);
    }
}

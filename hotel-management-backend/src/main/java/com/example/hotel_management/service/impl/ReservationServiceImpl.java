package com.example.hotel_management.service.impl;

import com.example.hotel_management.entity.Reservation;
import com.example.hotel_management.entity.Room;
import com.example.hotel_management.enums.ReservationStatus;
import com.example.hotel_management.enums.RoomStatus;
import com.example.hotel_management.enums.UserRole;
import com.example.hotel_management.repository.ReservationRepository;
import com.example.hotel_management.repository.RoomRepository;
import com.example.hotel_management.service.ReservationService;
import com.example.hotel_management.dto.ReservationDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;

    @Override
    public ReservationDTO createReservation(Reservation reservation) {
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
        
        // Set initial status based on user role and set the creator
        reservation.setStatus(reservation.getCreatedBy().getRole().equals(UserRole.ADMIN) ? ReservationStatus.CONFIRMED : ReservationStatus.PENDING);
        reservation.setHotel(room.getHotel());
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());
        
        return ReservationDTO.fromEntity(reservationRepository.save(reservation));
    }

    @Override
    public ReservationDTO updateReservation(Long id, Reservation updatedReservation) {
        Reservation existingReservation = getReservationEntityById(id);
        
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
        
        existingReservation.setUpdatedAt(LocalDateTime.now());
        
        return ReservationDTO.fromEntity(reservationRepository.save(existingReservation));
    }

    @Override
    public void cancelReservation(Long id) {
        Reservation reservation = getReservationEntityById(id);
        
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
        
//        if (reservation.getCheckInTime().isBefore(LocalDateTime.now())) {
//            throw new IllegalArgumentException("Check-in time cannot be in the past");
//        }
        
        // Ensure minimum stay duration
//        if (ChronoUnit.HOURS.between(reservation.getCheckInTime(),
//                                   reservation.getCheckOutTime()) < 24) {
//            throw new IllegalArgumentException("Minimum stay duration is 1 day");
//        }
    }

    private void validateStatusTransition(ReservationStatus currentStatus, ReservationStatus newStatus) {
        if (currentStatus == newStatus) {
            return; // No change, always valid
        }

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
            case CHECKED_OUT:
            case CANCELLED:
                throw new IllegalStateException("Cannot change status of a " + currentStatus.toString().toLowerCase() + " reservation");
            default:
                throw new IllegalStateException("Unexpected current status: " + currentStatus);
        }
    }

    @Override
    public ReservationDTO getReservationById(Long id) {
        return ReservationDTO.fromEntity(getReservationEntityById(id));
    }

    @Override
    public List<ReservationDTO> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(ReservationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservationDTO> getReservationsByUserId(Long userId) {
        return reservationRepository.findByGuestId(userId).stream()
                .map(ReservationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservationDTO> getReservationsByHotelId(Long hotelId) {
        return reservationRepository.findByHotelId(hotelId).stream()
                .map(ReservationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservationDTO> getUpcomingReservations(Long guestId) {
        return reservationRepository.findByGuestIdAndCheckInTimeAfter(guestId, LocalDateTime.now()).stream()
                .map(ReservationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservationDTO> getCurrentReservations(Long guestId) {
        return reservationRepository.findCurrentReservations(guestId, LocalDateTime.now()).stream()
                .map(ReservationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // New method to update reservation statuses based on time
    @Scheduled(fixedRate = 120000) // Run every 2 minutes
    public void updateReservationStatuses() {
        LocalDateTime now = LocalDateTime.now();    
        
        // Update reservations that should be CHECKED_IN
        List<Reservation> toCheckIn = reservationRepository.findByStatusAndCheckInTimeBefore(
            ReservationStatus.CONFIRMED, now);
        toCheckIn.forEach(reservation -> {
            reservation.setStatus(ReservationStatus.CHECKED_IN);
            // Update room status to OCCUPIED
            Room room = reservation.getRoom();
            room.setStatus(RoomStatus.OCCUPIED);
            roomRepository.save(room);
            reservationRepository.save(reservation);
        });
        
        // Update reservations that should be CHECKED_OUT
        List<Reservation> toCheckOut = reservationRepository.findByStatusAndCheckOutTimeBefore(
            ReservationStatus.CHECKED_IN, now);
        toCheckOut.forEach(reservation -> {
            reservation.setStatus(ReservationStatus.CHECKED_OUT);
            // Update room status to AVAILABLE
            Room room = reservation.getRoom();
            room.setStatus(RoomStatus.AVAILABLE);
            roomRepository.save(room);
            reservationRepository.save(reservation);
        });
    }

    // Method to manually check and update a specific reservation's status
    public void updateReservationStatusBasedOnTime(Long reservationId) {
        Reservation reservation = getReservationEntityById(reservationId);
        LocalDateTime now = LocalDateTime.now();
        
        if (reservation.getStatus() == ReservationStatus.CONFIRMED 
            && now.isAfter(reservation.getCheckInTime())) {
            reservation.setStatus(ReservationStatus.CHECKED_IN);
            reservationRepository.save(reservation);
        } else if (reservation.getStatus() == ReservationStatus.CHECKED_IN 
            && now.isAfter(reservation.getCheckOutTime())) {
            reservation.setStatus(ReservationStatus.CHECKED_OUT);
            reservationRepository.save(reservation);
        }
    }

    @Override
    @Transactional
    public ReservationDTO updateReservationStatus(Long id, ReservationStatus status) {
        Reservation reservation = getReservationEntityById(id);
        Room room = reservation.getRoom();
        
        // Validate the status transition
        validateStatusTransition(reservation.getStatus(), status);
        
        // Update reservation status
        reservation.setStatus(status);
        reservation.setUpdatedAt(LocalDateTime.now());
        
        // Update room status based on reservation status
        switch (status) {
            case CHECKED_IN:
                room.setStatus(RoomStatus.OCCUPIED);
                break;
            case CHECKED_OUT:
            case CANCELLED:
                room.setStatus(RoomStatus.AVAILABLE);
                break;
            case CONFIRMED:
                // Room status remains unchanged for confirmed reservations
                break;
            default:
                throw new IllegalArgumentException("Unexpected reservation status: " + status);
        }
        
        // Save both reservation and room updates
        roomRepository.save(room);
        Reservation updatedReservation = reservationRepository.save(reservation);
        
        return ReservationDTO.fromEntity(updatedReservation);
    }

    private Reservation getReservationEntityById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reservation not found with id: " + id));
    }
}

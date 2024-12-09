package com.example.hotel_management.controller;

import com.example.hotel_management.dto.ReservationDTO;
import com.example.hotel_management.dto.UpdateStatusRequest;
import com.example.hotel_management.entity.Reservation;
import com.example.hotel_management.service.ReservationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    @Autowired
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<ReservationDTO> createReservation(@Valid @RequestBody Reservation reservation) {
        return ResponseEntity.ok(reservationService.createReservation(reservation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservationDTO> updateReservation(
            @PathVariable Long id,
            @Valid @RequestBody Reservation reservation) {
        return ResponseEntity.ok(reservationService.updateReservation(id, reservation));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationDTO> getReservation(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    @GetMapping
    public ResponseEntity<List<ReservationDTO>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @GetMapping("/guest/{guestId}")
    public ResponseEntity<List<ReservationDTO>> getReservationsByGuest(@PathVariable Long guestId) {
        return ResponseEntity.ok(reservationService.getReservationsByUserId(guestId));
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<ReservationDTO>> getReservationsByHotelId(@PathVariable Long hotelId) {
        return ResponseEntity.ok(reservationService.getReservationsByHotelId(hotelId));
    }

    @GetMapping("/guest/{guestId}/upcoming")
    public ResponseEntity<List<ReservationDTO>> getUpcomingReservations(@PathVariable Long guestId) {
        return ResponseEntity.ok(reservationService.getUpcomingReservations(guestId));
    }

    @GetMapping("/guest/{guestId}/current")
    public ResponseEntity<List<ReservationDTO>> getCurrentReservations(@PathVariable Long guestId) {
        return ResponseEntity.ok(reservationService.getCurrentReservations(guestId));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/update-status")
    public ResponseEntity<Void> updateReservationStatus(@PathVariable Long id) {
        reservationService.updateReservationStatusBasedOnTime(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ReservationDTO> updateReservationStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest statusRequest) {
        try {
            ReservationDTO updatedReservation = reservationService.updateReservationStatus(id, statusRequest.getStatus());
            return ResponseEntity.ok(updatedReservation);
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}

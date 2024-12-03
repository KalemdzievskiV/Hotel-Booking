package com.example.hotel_management.controller;

import com.example.hotel_management.entity.Reservation;
import com.example.hotel_management.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Reservation> createReservation(@Valid @RequestBody Reservation reservation) {
        return ResponseEntity.ok(reservationService.createReservation(reservation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(
            @PathVariable Long id,
            @Valid @RequestBody Reservation reservation) {
        return ResponseEntity.ok(reservationService.updateReservation(id, reservation));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservation(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @GetMapping("/guest/{guestId}")
    public ResponseEntity<List<Reservation>> getReservationsByGuest(@PathVariable Long guestId) {
        return ResponseEntity.ok(reservationService.getReservationsByUserId(guestId));
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<Reservation>> getReservationsByHotel(@PathVariable Long hotelId) {
        return ResponseEntity.ok(reservationService.getReservationsByHotelId(hotelId));
    }

    @GetMapping("/guest/{guestId}/upcoming")
    public ResponseEntity<List<Reservation>> getUpcomingReservations(@PathVariable Long guestId) {
        return ResponseEntity.ok(reservationService.getUpcomingReservations(guestId));
    }

    @GetMapping("/guest/{guestId}/current")
    public ResponseEntity<List<Reservation>> getCurrentReservations(@PathVariable Long guestId) {
        return ResponseEntity.ok(reservationService.getCurrentReservations(guestId));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.ok().build();
    }
}

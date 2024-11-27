package com.example.hotel.booking.controller;

import com.example.hotel.booking.entity.Reservation;
import com.example.hotel.booking.entity.Room;
import com.example.hotel.booking.enums.ReservationStatusEnum;
import com.example.hotel.booking.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/reservation")
public class ReservationController {
    private ReservationService reservationService;
    @Autowired
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping("/add")
    public ResponseEntity<Reservation> addNewReservation(@RequestBody Reservation reservation){
        Reservation newReservation = reservationService.addNewReservation(reservation);
        return new ResponseEntity<>(newReservation, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<Reservation> updateReservation(@RequestBody Reservation reservation){
        Reservation newReservation = reservationService.updateReservation(reservation);
        return new ResponseEntity<>(newReservation, HttpStatus.OK);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable("id") Long id){
        Reservation reservation = reservationService.getReservationById(id);
        return new ResponseEntity<>(reservation, HttpStatus.OK);
    }

    @GetMapping("/find/room/{id}")
    public ResponseEntity<List<Reservation>> getReservationByRoomId(@PathVariable("id") Long id){
        List<Reservation> reservations = reservationService.getReservationByRoomId(id);
        return new ResponseEntity<>(reservations, HttpStatus.OK);
    }

    @GetMapping("/list")
    public ResponseEntity<List<Reservation>> getAllReservations(){
        List<Reservation> reservations = reservationService.getReservationList();
        return new ResponseEntity<>(reservations, HttpStatus.OK);
    }

    @GetMapping("/pageable")
    public ResponseEntity<Page<Reservation>> getReservationsPageable(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Sort sort = Sort.by(Sort.Direction.DESC, "start");
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(reservationService.getReservationListPageable(pageable));
    }

    @DeleteMapping("/delete/{id}")
    public void deleteReservation(@PathVariable("id") Long id){
        reservationService.deleteReservation(id);
    }

    @GetMapping("/find/status/{status}")
    public ResponseEntity<List<Reservation>> getReservationsByStatus(@PathVariable("status") ReservationStatusEnum status){
        List<Reservation> reservations = reservationService.getReservationsByStatus(status);
        return new ResponseEntity<>(reservations, HttpStatus.OK);
    }

}

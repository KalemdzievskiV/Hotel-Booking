package com.example.hotel.booking.service;

import com.example.hotel.booking.entity.Reservation;

import java.util.List;

public interface ReservationService {
     public Reservation addNewReservation(Reservation reservation);
     public Reservation getReservationById(Long id);
     public List<Reservation> getReservationList();
     public void deleteReservation(Long id);


}

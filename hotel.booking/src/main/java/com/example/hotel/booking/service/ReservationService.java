package com.example.hotel.booking.service;

import com.example.hotel.booking.entity.Reservation;
import com.example.hotel.booking.entity.Room;
import com.example.hotel.booking.enums.ReservationStatusEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReservationService {
     public Reservation addNewReservation(Reservation reservation);
     public Reservation updateReservation(Reservation reservation);
     public Reservation getReservationById(Long id);
     public List<Reservation> getReservationByRoomId(Long id);
     public List<Reservation> getReservationList();
     public void deleteReservation(Long id);
     public List<Reservation> getReservationsByStatus(ReservationStatusEnum status);
     Page<Reservation> getReservationListPageable(Pageable pageable);
}

package com.example.hotel.booking.repository;

import com.example.hotel.booking.entity.Reservation;
import com.example.hotel.booking.enums.ReservationStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findReservationsByRoomId(Long id);
    List<Reservation> findReservationsByStatus(ReservationStatusEnum status);
}

package com.example.hotel.booking.service.impl;

import com.example.hotel.booking.entity.Reservation;
import com.example.hotel.booking.entity.Room;
import com.example.hotel.booking.repository.ReservationRepository;
import com.example.hotel.booking.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Qualifier("reservationService")
public class ReservationServiceImpl implements ReservationService {
    private ReservationRepository reservationRepository;

    @Autowired
    public ReservationServiceImpl(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    @Override
    public Reservation addNewReservation(Reservation reservation) {
        Reservation newReservation = new Reservation();
        Optional.ofNullable(reservation.getDateIn()).ifPresent(newReservation::setDateIn);
        Optional.ofNullable(reservation.getDateOut()).ifPresent(newReservation::setDateOut);
        Optional.ofNullable(reservation.getUser()).ifPresent(newReservation::setUser);
        Optional.ofNullable(reservation.getRoom()).ifPresent(newReservation::setRoom);

        reservationRepository.save(newReservation);
        return newReservation;
    }

    @Override
    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id).orElse(null);
    }

    @Override
    public List<Reservation> getReservationList() {
        return reservationRepository.findAll();
    }

    @Override
    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }
}

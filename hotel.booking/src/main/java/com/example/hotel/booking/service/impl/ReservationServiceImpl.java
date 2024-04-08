package com.example.hotel.booking.service.impl;

import com.example.hotel.booking.entity.Reservation;
import com.example.hotel.booking.enums.ReservationStatusEnum;
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
        Optional.ofNullable(reservation.getStart()).ifPresent(newReservation::setStart);
        Optional.ofNullable(reservation.getFinish()).ifPresent(newReservation::setFinish);
        if (reservation.getStatus() == null){
            newReservation.setStatus(ReservationStatusEnum.BOOKED);
        } else {
            newReservation.setStatus(reservation.getStatus());
        }
        Optional.ofNullable(reservation.getUser()).ifPresent(newReservation::setUser);
        Optional.ofNullable(reservation.getRoom()).ifPresent(newReservation::setRoom);

        reservationRepository.save(newReservation);
        return newReservation;
    }

    @Override
    public Reservation updateReservation(Reservation reservation) {
        Reservation newReservation = reservationRepository.findById(reservation.getId()).orElse(null);
        Optional.ofNullable(reservation.getStart()).ifPresent(newReservation::setStart);
        Optional.ofNullable(reservation.getFinish()).ifPresent(newReservation::setFinish);
        Optional.ofNullable(reservation.getStatus()).ifPresent(newReservation::setStatus);
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
    public List<Reservation> getReservationByRoomId(Long id) {
        return reservationRepository.findReservationsByRoomId(id);
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

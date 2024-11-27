package com.example.hotel.booking.service.impl;

import com.example.hotel.booking.entity.Reservation;
import com.example.hotel.booking.enums.ReservationStatusEnum;
import com.example.hotel.booking.repository.ReservationRepository;
import com.example.hotel.booking.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<Reservation> getReservationListPageable(Pageable pageable) {
        return reservationRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Reservation addNewReservation(Reservation reservation) {
        Reservation newReservation = new Reservation();
        Optional.ofNullable(reservation.getStart()).ifPresent(newReservation::setStart);
        Optional.ofNullable(reservation.getFinish()).ifPresent(newReservation::setFinish);
        if (reservation.getStatus() == null){
            if (reservation.getFinish().isBefore(LocalDateTime.now())){
                newReservation.setStatus(ReservationStatusEnum.COMPLETED);
            }
            else{
                newReservation.setStatus(ReservationStatusEnum.BOOKED);
            }
        } else {
            newReservation.setStatus(reservation.getStatus());
        }
        Optional.ofNullable(reservation.getUser()).ifPresent(newReservation::setUser);
        Optional.ofNullable(reservation.getRoom()).ifPresent(newReservation::setRoom);

        reservationRepository.save(newReservation);
        return newReservation;
    }

    @Override
    @Transactional
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

    @Override
    public List<Reservation> getReservationsByStatus(ReservationStatusEnum status) {
        return reservationRepository.findReservationsByStatus(status);
    }
}

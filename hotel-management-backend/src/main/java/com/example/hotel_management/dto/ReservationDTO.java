package com.example.hotel_management.dto;

import com.example.hotel_management.entity.Reservation;
import com.example.hotel_management.enums.ReservationStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReservationDTO {
    private Long id;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private ReservationStatus status;
    private RoomDTO room;
    private Long hotelId;
    private UserDTO guest;
    private UserDTO createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ReservationDTO fromEntity(Reservation reservation) {
        if (reservation == null) {
            return null;
        }

        ReservationDTO dto = new ReservationDTO();
        dto.setId(reservation.getId());
        dto.setCheckInTime(reservation.getCheckInTime());
        dto.setCheckOutTime(reservation.getCheckOutTime());
        dto.setStatus(reservation.getStatus());
        
        if (reservation.getRoom() != null) {
            dto.setRoom(RoomDTO.fromEntity(reservation.getRoom()));
        }
        
        if (reservation.getHotel() != null) {
            dto.setHotelId(reservation.getHotel().getId());
        }
        
        if (reservation.getGuest() != null) {
            dto.setGuest(UserDTO.fromEntity(reservation.getGuest()));
        }
        
        if (reservation.getCreatedBy() != null) {
            dto.setCreatedBy(UserDTO.fromEntity(reservation.getCreatedBy()));
        }
        
        dto.setCreatedAt(reservation.getCreatedAt());
        dto.setUpdatedAt(reservation.getUpdatedAt());
        return dto;
    }

    public Reservation toEntity() {
        Reservation reservation = new Reservation();
        reservation.setId(this.id);
        reservation.setCheckInTime(this.checkInTime);
        reservation.setCheckOutTime(this.checkOutTime);
        reservation.setStatus(this.status);
        
        if (this.room != null) {
            reservation.setRoom(this.room.toEntity());
        }
        
        if (this.guest != null) {
            reservation.setGuest(this.guest.toEntity());
        }
        
        if (this.createdBy != null) {
            reservation.setCreatedBy(this.createdBy.toEntity());
        }
        
        reservation.setCreatedAt(this.createdAt);
        reservation.setUpdatedAt(this.updatedAt);
        return reservation;
    }
}

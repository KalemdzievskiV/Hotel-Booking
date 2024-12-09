package com.example.hotel_management.dto;

import com.example.hotel_management.enums.ReservationStatus;
import lombok.Data;

@Data
public class UpdateStatusRequest {
    private ReservationStatus status;
}

package com.example.hotel_management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotelStatsDTO {
    private long totalBookings;
    private int activeGuests;
    private int availableRooms;
    private double monthlyRevenue;
    private List<ReservationDTO> recentBookings;
    private List<RoomTypeStatsDTO> roomTypeStats;
    private List<ReservationDTO> upcomingCheckouts;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoomTypeStatsDTO {
        private String type;
        private double percentage;
    }
}

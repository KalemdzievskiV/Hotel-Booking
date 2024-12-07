package com.example.hotel_management.dto;

import lombok.Data;
import java.util.List;
import java.util.Set;

@Data
public class HotelResponseDTO {
    private Long id;
    private String name;
    private String address;
    private String description;
    private String phoneNumber;
    private String email;
    private Integer starRating;
    private Set<String> amenities;
    private List<String> pictures;
    private Double averageRating;
    private Integer totalReviews;
    private Long adminId;
    private String adminEmail;
}

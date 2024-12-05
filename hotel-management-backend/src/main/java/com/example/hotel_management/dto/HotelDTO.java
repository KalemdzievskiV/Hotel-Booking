package com.example.hotel_management.dto;

import lombok.Data;
import java.util.List;
import java.util.Set;

@Data
public class HotelDTO {
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
    private Long admin_id;
}

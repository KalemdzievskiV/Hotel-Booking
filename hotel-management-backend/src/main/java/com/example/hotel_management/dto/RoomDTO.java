package com.example.hotel_management.dto;

import com.example.hotel_management.entity.Room;
import com.example.hotel_management.entity.Picture;
import com.example.hotel_management.enums.RoomStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class RoomDTO {
    private Long id;
    private String number;
    private String name;
    private String description;
    private RoomStatus status;
    private BigDecimal price;
    private List<String> pictures = new ArrayList<>();
    private Long hotelId;

    public static RoomDTO fromEntity(Room room) {
        if (room == null) {
            return null;
        }

        RoomDTO roomDTO = new RoomDTO();
        roomDTO.setId(room.getId());
        roomDTO.setNumber(room.getNumber());
        roomDTO.setName(room.getName());
        roomDTO.setDescription(room.getDescription());
        roomDTO.setStatus(room.getStatus());
        roomDTO.setPrice(room.getPrice());
        
        if (room.getPictures() != null) {
            roomDTO.setPictures(room.getPictures().stream()
                    .filter(p -> p != null && p.getUrl() != null)
                    .map(Picture::getUrl)
                    .collect(Collectors.toList()));
        }
        
        if (room.getHotel() != null) {
            roomDTO.setHotelId(room.getHotel().getId());
        }
        
        return roomDTO;
    }
}

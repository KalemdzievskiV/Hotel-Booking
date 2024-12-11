package com.example.hotel_management.service.impl;

import com.example.hotel_management.entity.Room;
import com.example.hotel_management.entity.Picture;
import com.example.hotel_management.enums.RoomStatus;
import com.example.hotel_management.repository.RoomRepository;
import com.example.hotel_management.service.RoomService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    @Override
    public Room createRoom(Room room) {
        validateRoomData(room);
        
        if (roomRepository.existsByNumberAndHotelId(room.getNumber(), room.getHotel().getId())) {
            throw new IllegalStateException(
                String.format("Room with number %s already exists in hotel with ID %d", 
                    room.getNumber(), room.getHotel().getId()));
        }
        
        if (room.getStatus() == null) {
            room.setStatus(RoomStatus.AVAILABLE);
        }
        
        return roomRepository.save(room);
    }

    @Override
    public Room updateRoom(Long id, Room room) {
        Room existingRoom = getRoomById(id);
        
        // Preserve hotel association
        room.setHotel(existingRoom.getHotel());
        
        validateRoomData(room);
        
        // Check if room number is being changed and if it already exists
        if (!existingRoom.getNumber().equals(room.getNumber()) &&
            roomRepository.existsByNumberAndHotelId(room.getNumber(), room.getHotel().getId())) {
            throw new IllegalStateException(
                String.format("Room with number %s already exists in hotel with ID %d", 
                    room.getNumber(), room.getHotel().getId()));
        }
        
        existingRoom.setNumber(room.getNumber());
        existingRoom.setName(room.getName());
        existingRoom.setDescription(room.getDescription());
        existingRoom.setStatus(room.getStatus());
        existingRoom.setPrice(room.getPrice());
        
        // Handle pictures using the helper method
        if (room.getPictures() != null) {
            existingRoom.setPictures(new HashSet<>(room.getPictures()));
        }
        
        return roomRepository.save(existingRoom);
    }

    @Override
    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Room not found with id: " + id));
    }

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Room> getRoomsByHotelId(Long hotelId) {
        return roomRepository.findByHotelId(hotelId);
    }

    @Override
    public List<Room> getAvailableRoomsByHotel(Long hotelId) {
        return roomRepository.findByHotelIdAndStatus(hotelId, RoomStatus.AVAILABLE);
    }

    @Override
    public List<Room> getRoomsByPriceRange(Long hotelId, BigDecimal minPrice, BigDecimal maxPrice) {
        validatePriceRange(minPrice, maxPrice);
        return roomRepository.findByHotelIdAndPriceBetween(hotelId, minPrice, maxPrice);
    }

    @Override
    public List<Room> getAvailableRoomsByPriceRange(Long hotelId, BigDecimal minPrice, BigDecimal maxPrice) {
        validatePriceRange(minPrice, maxPrice);
        return roomRepository.findAvailableRoomsByPriceRange(hotelId, RoomStatus.AVAILABLE, minPrice, maxPrice);
    }

    @Override
    public List<Room> getAvailableRoomsSortedByPrice(Long hotelId) {
        return roomRepository.findAvailableRoomsSortedByPrice(hotelId, RoomStatus.AVAILABLE);
    }

    @Override
    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new EntityNotFoundException("Room not found with id: " + id);
        }
        roomRepository.deleteById(id);
    }

    @Override
    public Room updateRoomStatus(Long id, RoomStatus status) {
        Room room = getRoomById(id);
        room.setStatus(status);
        return roomRepository.save(room);
    }

    @Override
    public Room updateRoomStatusByReservation(Long id, String reservationStatus) {
        Room room = getRoomById(id);
        RoomStatus newStatus;

        switch (reservationStatus.toUpperCase()) {
            case "CHECKED_IN":
                newStatus = RoomStatus.OCCUPIED;
                break;
            case "CHECKED_OUT":
                newStatus = RoomStatus.AVAILABLE;
                break;
            case "CONFIRMED":
                // Room remains in its current status until check-in
                return room;
            case "CANCELLED":
                newStatus = RoomStatus.AVAILABLE;
                break;
            default:
                throw new IllegalArgumentException("Invalid reservation status: " + reservationStatus);
        }

        room.setStatus(newStatus);
        return roomRepository.save(room);
    }

    @Override
    public long getAvailableRoomCount(Long hotelId) {
        return roomRepository.countByHotelIdAndStatus(hotelId, RoomStatus.AVAILABLE);
    }

    @Override
    public Room uploadPicture(Long id, MultipartFile picture) throws IOException {
        Room room = getRoomById(id);
        
        // Convert MultipartFile to base64 string
        String base64Picture = Base64.getEncoder().encodeToString(picture.getBytes());
        
        // Create new Picture entity
        Picture pictureEntity = new Picture();
        pictureEntity.setUrl("data:" + picture.getContentType() + ";base64," + base64Picture);
        
        // Use helper method to maintain bidirectional relationship
        room.addPicture(pictureEntity);
        
        return roomRepository.save(room);
    }

    private void validateRoomData(Room room) {
        if (room.getNumber() == null || room.getNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Room number cannot be empty");
        }
        if (room.getName() == null || room.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Room name cannot be empty");
        }
        if (room.getPrice() == null) {
            throw new IllegalArgumentException("Room price cannot be null");
        }
        if (room.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Room price must be greater than zero");
        }
        if (room.getHotel() == null || room.getHotel().getId() == null) {
            throw new IllegalArgumentException("Room must be associated with a hotel");
        }
    }

    private void validatePriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        if (minPrice == null || maxPrice == null) {
            throw new IllegalArgumentException("Price range values cannot be null");
        }
        if (minPrice.compareTo(BigDecimal.ZERO) < 0 || maxPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Price range values cannot be negative");
        }
        if (minPrice.compareTo(maxPrice) > 0) {
            throw new IllegalArgumentException("Minimum price cannot be greater than maximum price");
        }
    }
}

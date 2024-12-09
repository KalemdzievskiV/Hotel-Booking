package com.example.hotel_management.service;

import com.example.hotel_management.entity.Room;
import com.example.hotel_management.enums.RoomStatus;
import java.math.BigDecimal;
import java.util.List;

public interface RoomService {
    /**
     * Creates a new room with validation
     * @param room Room entity to create
     * @return Created room
     * @throws IllegalStateException if room number already exists in the hotel
     * @throws IllegalArgumentException if required fields are missing or invalid
     */
    Room createRoom(Room room);

    /**
     * Updates an existing room
     * @param id Room ID to update
     * @param room Updated room data
     * @return Updated room
     * @throws EntityNotFoundException if room not found
     * @throws IllegalStateException if room number is changed and already exists
     * @throws IllegalArgumentException if required fields are missing or invalid
     */
    Room updateRoom(Long id, Room room);

    /**
     * Retrieves a room by ID
     * @param id Room ID
     * @return Room entity
     * @throws EntityNotFoundException if room not found
     */
    Room getRoomById(Long id);

    /**
     * Retrieves all rooms
     * @return List of all rooms
     */
    List<Room> getAllRooms();

    /**
     * Retrieves all rooms for a specific hotel
     * @param hotelId Hotel ID
     * @return List of rooms in the hotel
     */
    List<Room> getRoomsByHotelId(Long hotelId);

    /**
     * Retrieves available rooms for a specific hotel
     * @param hotelId Hotel ID
     * @return List of available rooms
     */
    List<Room> getAvailableRoomsByHotel(Long hotelId);

    /**
     * Retrieves rooms within a price range for a specific hotel
     * @param hotelId Hotel ID
     * @param minPrice Minimum price
     * @param maxPrice Maximum price
     * @return List of rooms within price range
     * @throws IllegalArgumentException if price range is invalid
     */
    List<Room> getRoomsByPriceRange(Long hotelId, BigDecimal minPrice, BigDecimal maxPrice);

    /**
     * Retrieves available rooms within a price range for a specific hotel
     * @param hotelId Hotel ID
     * @param minPrice Minimum price
     * @param maxPrice Maximum price
     * @return List of available rooms within price range
     * @throws IllegalArgumentException if price range is invalid
     */
    List<Room> getAvailableRoomsByPriceRange(Long hotelId, BigDecimal minPrice, BigDecimal maxPrice);

    /**
     * Retrieves available rooms sorted by price for a specific hotel
     * @param hotelId Hotel ID
     * @return List of available rooms sorted by price
     */
    List<Room> getAvailableRoomsSortedByPrice(Long hotelId);

    /**
     * Deletes a room by ID
     * @param id Room ID
     * @throws EntityNotFoundException if room not found
     */
    void deleteRoom(Long id);

    /**
     * Updates room status
     * @param id Room ID
     * @param status New room status
     * @return Updated room
     * @throws EntityNotFoundException if room not found
     */
    Room updateRoomStatus(Long id, RoomStatus status);

    /**
     * Updates room status by reservation status
     * @param id Room ID
     * @param reservationStatus New reservation status
     * @return Updated room
     * @throws EntityNotFoundException if room not found
     */
    Room updateRoomStatusByReservation(Long id, String reservationStatus);

    /**
     * Gets count of available rooms for a specific hotel
     * @param hotelId Hotel ID
     * @return Count of available rooms
     */
    long getAvailableRoomCount(Long hotelId);
}

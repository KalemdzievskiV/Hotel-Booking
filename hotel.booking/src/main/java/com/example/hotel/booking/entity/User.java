package com.example.hotel.booking.entity;

import com.example.hotel.booking.enums.UserRoleEnum;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "\"User\"")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private LocalDateTime memberSince;
    private UserRoleEnum userRole;
    private String phoneNumber;
    private String email;
    private String password;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Room> rooms = new ArrayList<>();

    // Helper methods to maintain bidirectional relationship
    public void addRoom(Room room) {
        rooms.add(room);
        room.setUser(this);
    }

    public void removeRoom(Room room) {
        rooms.remove(room);
        room.setUser(null);
    }
}

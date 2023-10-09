package com.example.hotel.booking.entity;

import com.example.hotel.booking.enums.UserRoleEnum;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "\"User\"")
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

}


package com.example.hotel_management.dto;

import com.example.hotel_management.enums.UserRole;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserDTO {
    private String firstName;
    private String lastName;
    private String username;
    private String password; // Optional for updates
    private UserRole role;
    private String email;
    private String phoneNumber;
    private boolean active;
}

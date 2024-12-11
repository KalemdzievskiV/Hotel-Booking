package com.example.hotel_management.dto;

import com.example.hotel_management.enums.UserRole;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String username;
    private UserRole role;
    private String email;
    private String phoneNumber;
    private boolean active;

    public static UserDTO fromEntity(com.example.hotel_management.entity.User user) {
        if (user == null) {
            return null;
        }
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setActive(user.isActive());
        return dto;
    }

    public com.example.hotel_management.entity.User toEntity() {
        com.example.hotel_management.entity.User user = new com.example.hotel_management.entity.User();
        user.setId(this.id);
        user.setFirstName(this.firstName);
        user.setLastName(this.lastName);
        user.setUsername(this.username);
        user.setRole(this.role);
        user.setEmail(this.email);
        user.setPhoneNumber(this.phoneNumber);
        user.setActive(this.active);
        return user;
    }
}

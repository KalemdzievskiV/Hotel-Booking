package com.example.hotel_management.controller;

import com.example.hotel_management.dto.CreateUserDTO;
import com.example.hotel_management.dto.UpdateUserDTO;
import com.example.hotel_management.dto.UserDTO;
import com.example.hotel_management.entity.User;
import com.example.hotel_management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/users", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getUsername(),
            user.getRole(),
            user.getEmail(),
            user.getPhoneNumber(),
            user.isActive()
        );
    }

    private User convertCreateDTOToUser(CreateUserDTO createUserDTO) {
        User user = new User();
        user.setFirstName(createUserDTO.getFirstName());
        user.setLastName(createUserDTO.getLastName());
        user.setUsername(createUserDTO.getUsername());
        user.setPassword(createUserDTO.getPassword());
        user.setRole(createUserDTO.getRole());
        user.setEmail(createUserDTO.getEmail());
        user.setPhoneNumber(createUserDTO.getPhoneNumber());
        user.setActive(createUserDTO.isActive());
        return user;
    }

    private void updateUserFromDTO(User user, UpdateUserDTO updateUserDTO) {
        user.setFirstName(updateUserDTO.getFirstName());
        user.setLastName(updateUserDTO.getLastName());
        user.setUsername(updateUserDTO.getUsername());
        if (updateUserDTO.getPassword() != null && !updateUserDTO.getPassword().isEmpty()) {
            user.setPassword(updateUserDTO.getPassword());
        }
        user.setRole(updateUserDTO.getRole());
        user.setEmail(updateUserDTO.getEmail());
        user.setPhoneNumber(updateUserDTO.getPhoneNumber());
        user.setActive(updateUserDTO.isActive());
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateUserDTO createUserDTO) {
        User user = convertCreateDTOToUser(createUserDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(convertToDTO(userService.createUser(user)));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserDTO updateUserDTO) {
        User existingUser = userService.getUserById(id);
        updateUserFromDTO(existingUser, updateUserDTO);
        return ResponseEntity.ok(convertToDTO(userService.updateUser(id, existingUser)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(convertToDTO(userService.getUserById(id)));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(convertToDTO(userService.getUserByEmail(email)));
    }

    @GetMapping("/email/{email}/active/{active}")
    public ResponseEntity<UserDTO> getUserByEmailAndActive(
            @PathVariable String email,
            @PathVariable boolean active) {
        return ResponseEntity.ok(convertToDTO(userService.getUserByEmailAndActive(email, active)));
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<Void> activateUser(@PathVariable Long id) {
        userService.activateUser(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long id) {
        userService.deactivateUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmailExists(@RequestParam String email) {
        return ResponseEntity.ok(userService.existsByEmail(email));
    }
}

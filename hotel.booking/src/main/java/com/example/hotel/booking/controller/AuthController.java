package com.example.hotel.booking.controller;

import com.example.hotel.booking.entity.User;
import com.example.hotel.booking.enums.UserRoleEnum;
import com.example.hotel.booking.security.JwtUtil;
import com.example.hotel.booking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginUser.getEmail(), loginUser.getPassword())
        );

        final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        final String jwt = jwtUtil.generateToken(userDetails);
        
        User user = userService.getUserByEmail(loginUser.getEmail());
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("email", user.getEmail());
        response.put("role", user.getUserRole().toString());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        // Store the original password for authentication
        String originalPassword = user.getPassword();

        user.setMemberSince(LocalDateTime.now());
        user.setUserRole(UserRoleEnum.USER); // Default role

        User savedUser = userService.createUser(user);

        Map<String, Object> response = new HashMap<>();
        // Login the user after signup
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), originalPassword)
            );
            final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            final String jwt = jwtUtil.generateToken(userDetails);

            response.put("token", jwt);
            response.put("email", savedUser.getEmail());
            response.put("role", savedUser.getUserRole().toString());
            response.put("firstName", savedUser.getFirstName());
            response.put("lastName", savedUser.getLastName());
        } catch (Exception e) {
            e.printStackTrace();
            // If authentication fails, still return user info without token
            response.put("message", "User registered successfully");
            response.put("email", savedUser.getEmail());
            response.put("firstName", savedUser.getFirstName());
            response.put("lastName", savedUser.getLastName());
        }
        
        return ResponseEntity.ok(response);
    }
}

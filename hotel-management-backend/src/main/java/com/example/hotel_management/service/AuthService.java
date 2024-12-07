package com.example.hotel_management.service;

import com.example.hotel_management.dto.LoginRequest;
import com.example.hotel_management.entity.User;
import com.example.hotel_management.enums.UserRole;
import com.example.hotel_management.repository.UserRepository;
import com.example.hotel_management.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(AuthenticationManager authenticationManager,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public Map<String, String> login(LoginRequest loginRequest) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String token = jwtUtil.generateToken(user.getEmail());
        
        Map<String, String> response = new HashMap<>();
        response.put("id", String.valueOf(user.getId()));
        response.put("token", token);
        response.put("email", user.getEmail());
        response.put("username", user.getUsername());
        response.put("role", user.getRole().name());
        
        return response;
    }

    public Map<String, String> signup(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(UserRole.SUPER_ADMIN);
        user.setActive(true);
        
        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getEmail());
        
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("email", savedUser.getEmail());
        response.put("username", savedUser.getUsername());
        response.put("role", savedUser.getRole().name());
        
        return response;
    }
}

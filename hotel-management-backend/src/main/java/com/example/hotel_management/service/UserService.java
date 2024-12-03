package com.example.hotel_management.service;

import com.example.hotel_management.entity.User;
import java.util.List;

public interface UserService {
    User createUser(User user);
    User updateUser(Long id, User user);
    User getUserById(Long id);
    User getUserByEmail(String email);
    User getUserByEmailAndActive(String email, boolean active);
    List<User> getAllUsers();
    void deleteUser(Long id);
    boolean existsByEmail(String email);
    void activateUser(Long id);
    void deactivateUser(Long id);
}

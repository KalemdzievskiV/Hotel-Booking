package com.example.hotel.booking.service;

import com.example.hotel.booking.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    User addNewUser(User user);
    User updateUser(User user);
    User getUserById(Long id);
    List<User> getUserList();
    Page<User> getUserListPageable(Pageable pageable);
    User getUserByFirstName(String firstName);
    void deleteUser(Long id);
    User getUserByEmail(String email);
    boolean existsByEmail(String email);
    User createUser(User user);
}

package com.example.hotel.booking.service;

import com.example.hotel.booking.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    public User addNewUser(User user);
    public User updateUser(User user);
    public User getUserById(Long id);
    public List<User> getUserList();
    public Page<User> getUserListPageable(Pageable pageable);
    public User getUserByFirstName(String firstName);
    public void deleteUser(Long id);
}

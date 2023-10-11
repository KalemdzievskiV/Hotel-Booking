package com.example.hotel.booking.service;

import com.example.hotel.booking.entity.User;

import java.util.List;

public interface UserService {
    public User addNewUser(User user);
    public User getUserById(Long id);
    public List<User> getUserList();
    public User getUserByFirstName(String firstName);
    public void deleteUser(Long id);
}

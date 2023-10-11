package com.example.hotel.booking.service.impl;

import com.example.hotel.booking.entity.User;
import com.example.hotel.booking.repository.UserRepository;
import com.example.hotel.booking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Qualifier("userService")
public class UserServiceImpl implements UserService {
    private UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User addNewUser(User user) {
        User newUser = new User();
        Optional.ofNullable(user.getFirstName()).ifPresent(newUser::setFirstName);
        Optional.ofNullable(user.getLastName()).ifPresent(newUser::setLastName);
        Optional.ofNullable(user.getMemberSince()).ifPresent(newUser::setMemberSince);
        Optional.ofNullable(user.getUserRole()).ifPresent(newUser::setUserRole);
        Optional.ofNullable(user.getPhoneNumber()).ifPresent(newUser::setPhoneNumber);
        Optional.ofNullable(user.getEmail()).ifPresent(newUser::setEmail);
        if (user.getPassword() != null){
            //TODO: Encrypt password
            newUser.setPassword(user.getPassword());
        }
        userRepository.save(newUser);
        return newUser;
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public List<User> getUserList() {
        return userRepository.findAll();
    }

    @Override
    public User getUserByFirstName(String firstName) {
        return userRepository.findUserByFirstName(firstName);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}

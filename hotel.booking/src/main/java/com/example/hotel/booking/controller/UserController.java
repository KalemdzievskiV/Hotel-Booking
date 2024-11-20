package com.example.hotel.booking.controller;

import com.example.hotel.booking.entity.User;
import com.example.hotel.booking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/user")
public class UserController {
    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/add")
    public ResponseEntity<User> addNewUser(@RequestBody User user){
        return new ResponseEntity<>(userService.addNewUser(user), HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<User> updateUser(@RequestBody User user){
        return new ResponseEntity<>(userService.updateUser(user), HttpStatus.OK);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        User user = userService.getUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/list")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getUserList();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/pageable")
    public ResponseEntity<Page<User>> getUsersPageable(Pageable pageable) {
        Page<User> users = userService.getUserListPageable(pageable);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/find/{firstName}")
    public ResponseEntity<User> getUserByFirstName(@PathVariable("firstName") String firstName) {
        User user = userService.getUserByFirstName(firstName);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
    }
}

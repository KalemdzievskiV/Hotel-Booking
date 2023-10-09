package com.example.hotel.booking.repository;

import com.example.hotel.booking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findUserByFirstName(String firstname);
}

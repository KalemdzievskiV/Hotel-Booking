package com.example.hotel_management.controller;

import com.example.hotel_management.entity.Subscription;
import com.example.hotel_management.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "*")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<Subscription> createSubscription(@RequestBody Subscription subscription) {
        return ResponseEntity.ok(subscriptionService.createSubscription(subscription));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subscription> updateSubscription(@PathVariable Long id, @RequestBody Subscription subscription) {
        return ResponseEntity.ok(subscriptionService.updateSubscription(id, subscription));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subscription> getSubscription(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionById(id));
    }

    @GetMapping
    public ResponseEntity<List<Subscription>> getAllSubscriptions() {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptions());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Subscription>> getSubscriptionsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByUserId(userId));
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<Subscription>> getSubscriptionsByHotel(@PathVariable Long hotelId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByHotelId(hotelId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Long id) {
        subscriptionService.deleteSubscription(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkSubscription(
            @RequestParam Long userId,
            @RequestParam Long hotelId) {
        return ResponseEntity.ok(subscriptionService.isUserSubscribed(userId, hotelId));
    }

    @DeleteMapping("/user/{userId}/hotel/{hotelId}")
    public ResponseEntity<Void> cancelSubscription(
            @PathVariable Long userId,
            @PathVariable Long hotelId) {
        subscriptionService.cancelSubscription(userId, hotelId);
        return ResponseEntity.ok().build();
    }
}

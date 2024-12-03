package com.example.hotel_management.service;

import com.example.hotel_management.entity.Subscription;
import java.util.List;

public interface SubscriptionService {
    Subscription createSubscription(Subscription subscription);
    Subscription updateSubscription(Long id, Subscription subscription);
    Subscription getSubscriptionById(Long id);
    List<Subscription> getAllSubscriptions();
    List<Subscription> getSubscriptionsByUserId(Long userId);
    List<Subscription> getSubscriptionsByHotelId(Long hotelId);
    void deleteSubscription(Long id);
    boolean isUserSubscribed(Long userId, Long hotelId);
    void cancelSubscription(Long userId, Long hotelId);
}

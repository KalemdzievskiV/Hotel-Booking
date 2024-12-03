package com.example.hotel_management.service.impl;

import com.example.hotel_management.entity.Subscription;
import com.example.hotel_management.repository.SubscriptionRepository;
import com.example.hotel_management.service.SubscriptionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    @Override
    public Subscription createSubscription(Subscription subscription) {
        if (isUserSubscribed(subscription.getUser().getId(), subscription.getHotel().getId())) {
            throw new IllegalStateException("User is already subscribed to this hotel");
        }
        return subscriptionRepository.save(subscription);
    }

    @Override
    public Subscription updateSubscription(Long id, Subscription subscription) {
        Subscription existingSubscription = getSubscriptionById(id);
        existingSubscription.setStatus(subscription.getStatus());
        existingSubscription.setNotificationType(subscription.getNotificationType());
        existingSubscription.setStartDate(subscription.getStartDate());
        existingSubscription.setEndDate(subscription.getEndDate());
        return subscriptionRepository.save(existingSubscription);
    }

    @Override
    public Subscription getSubscriptionById(Long id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subscription not found with id: " + id));
    }

    @Override
    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    @Override
    public List<Subscription> getSubscriptionsByUserId(Long userId) {
        return subscriptionRepository.findByUserId(userId);
    }

    @Override
    public List<Subscription> getSubscriptionsByHotelId(Long hotelId) {
        return subscriptionRepository.findByHotelId(hotelId);
    }

    @Override
    public void deleteSubscription(Long id) {
        subscriptionRepository.deleteById(id);
    }

    @Override
    public boolean isUserSubscribed(Long userId, Long hotelId) {
        return subscriptionRepository.existsByUserIdAndHotelId(userId, hotelId);
    }

    @Override
    public void cancelSubscription(Long userId, Long hotelId) {
        subscriptionRepository.findByUserIdAndHotelId(userId, hotelId)
                .ifPresent(subscription -> subscriptionRepository.delete(subscription));
    }
}

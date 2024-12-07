package com.example.hotel_management.entity;

import com.example.hotel_management.enums.NotificationType;
import com.example.hotel_management.enums.SubscriptionStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "subscriptions")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties("subscriptions")
    private User user;

    @ManyToOne
    @JoinColumn(name = "hotel_id", nullable = false)
    @JsonIgnoreProperties({"rooms", "reservations", "subscriptions"})
    private Hotel hotel;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType notificationType;
}

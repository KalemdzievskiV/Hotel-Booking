package com.example.hotel_management.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Set;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hotels")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private Integer starRating;

    @ElementCollection
    @CollectionTable(name = "hotel_amenities", joinColumns = @JoinColumn(name = "hotel_id"))
    @Column(name = "amenity")
    private Set<String> amenities;

    @ElementCollection
    @CollectionTable(name = "hotel_pictures", joinColumns = @JoinColumn(name = "hotel_id"))
    @Column(name = "picture_url", columnDefinition = "TEXT")
    private List<String> pictures;

    @Column(nullable = false)
    private Double averageRating = 0.0;

    @Column(nullable = false)
    private Integer totalReviews = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    @JsonIgnoreProperties({"hotels", "password", "hibernateLazyInitializer", "handler"})
    private User admin;

    @OneToMany(mappedBy = "hotel", fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hotel", "hibernateLazyInitializer", "handler"})
    private Set<Room> rooms;

    @OneToMany(mappedBy = "hotel", fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hotel", "hibernateLazyInitializer", "handler"})
    private Set<Reservation> reservations;

    @OneToMany(mappedBy = "hotel", fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hotel", "hibernateLazyInitializer", "handler"})
    private Set<Subscription> subscriptions;
}
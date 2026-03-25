package com.purrfectmarket.model;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "newsletter_subscribers", indexes = @Index(name = "idx_newsletter_email", unique = true, columnList = "email"))
public class NewsletterSubscriber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 254)
    private String email;

    @Column(name = "subscribed_at", nullable = false)
    private Instant subscribedAt = Instant.now();

    protected NewsletterSubscriber() {
    }

    public NewsletterSubscriber(String email) {
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public Instant getSubscribedAt() {
        return subscribedAt;
    }
}

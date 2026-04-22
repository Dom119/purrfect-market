package com.purrfectmarket.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "reviews", indexes = @Index(columnList = "product_id"))
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String authorName;

    @Column(nullable = false)
    private int rating;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(nullable = false)
    private Instant createdAt;

    protected Review() {}

    public Review(Long productId, String authorName, int rating, String title, String body, Instant createdAt) {
        this.productId = productId;
        this.authorName = authorName;
        this.rating = rating;
        this.title = title;
        this.body = body;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getProductId() { return productId; }
    public String getAuthorName() { return authorName; }
    public int getRating() { return rating; }
    public String getTitle() { return title; }
    public String getBody() { return body; }
    public Instant getCreatedAt() { return createdAt; }
}

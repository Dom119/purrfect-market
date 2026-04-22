package com.purrfectmarket.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "pending_reviews", indexes = @Index(columnList = "product_id"))
public class PendingReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "author_name", nullable = false)
    private String authorName;

    @Column(name = "author_email", nullable = false)
    private String authorEmail;

    @Column(nullable = false)
    private int rating;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(name = "submitted_at", nullable = false)
    private Instant submittedAt = Instant.now();

    protected PendingReview() {}

    public PendingReview(Long productId, String productName, Long userId,
                         String authorName, String authorEmail,
                         int rating, String title, String body) {
        this.productId = productId;
        this.productName = productName;
        this.userId = userId;
        this.authorName = authorName;
        this.authorEmail = authorEmail;
        this.rating = rating;
        this.title = title;
        this.body = body;
    }

    public Long getId() { return id; }
    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public Long getUserId() { return userId; }
    public String getAuthorName() { return authorName; }
    public String getAuthorEmail() { return authorEmail; }
    public int getRating() { return rating; }
    public String getTitle() { return title; }
    public String getBody() { return body; }
    public Instant getSubmittedAt() { return submittedAt; }
}

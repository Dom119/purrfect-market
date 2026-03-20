package com.purrfectmarket.model;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String category;

    @Column(name = "image_url")
    private String imageUrl;

    private Double rating;

    @Column(name = "review_count")
    private Integer reviewCount;

    @Column(length = 20)
    private String badge;

    @Column(name = "in_stock")
    private Boolean inStock = true;

    protected Product() {
    }

    public Product(String name, String description, Double price, String category,
                   String imageUrl, Double rating, Integer reviewCount, String badge, Boolean inStock) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.imageUrl = imageUrl;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.badge = badge;
        this.inStock = inStock != null ? inStock : true;
    }

    public Boolean getInStock() {
        return inStock;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Double getPrice() {
        return price;
    }

    public String getCategory() {
        return category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Double getRating() {
        return rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public String getBadge() {
        return badge;
    }
}

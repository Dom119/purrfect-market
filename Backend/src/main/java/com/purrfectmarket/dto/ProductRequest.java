package com.purrfectmarket.dto;

public record ProductRequest(
        String name,
        String description,
        Double price,
        String category,
        String imageUrl,
        Double rating,
        Integer reviewCount,
        String badge,
        Boolean inStock
) {
}

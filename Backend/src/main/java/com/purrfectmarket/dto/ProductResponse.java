package com.purrfectmarket.dto;

public record ProductResponse(
        Long id,
        String name,
        String description,
        Double price,
        String category,
        String imageUrl,
        Double rating,
        Integer reviewCount,
        String badge,
        Boolean inStock,
        Integer inventoryQuantity
) {
}

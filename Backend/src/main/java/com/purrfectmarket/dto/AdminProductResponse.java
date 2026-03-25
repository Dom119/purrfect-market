package com.purrfectmarket.dto;

public record AdminProductResponse(
        Long id,
        String name,
        String description,
        Double price,
        String category,
        String imageUrl,
        boolean hasStoredImage,
        Double rating,
        Integer reviewCount,
        String badge,
        Boolean inStock,
        Integer inventoryQuantity
) {
}

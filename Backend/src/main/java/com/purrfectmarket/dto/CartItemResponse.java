package com.purrfectmarket.dto;

public record CartItemResponse(
        Long productId,
        String productName,
        String imageUrl,
        Double price,
        Integer quantity,
        Double subtotal
) {
}

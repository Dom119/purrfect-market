package com.purrfectmarket.dto;

public record OrderItemResponse(
        Long productId,
        String productName,
        Integer quantity,
        Double unitPrice,
        Double subtotal
) {
}

package com.purrfectmarket.dto;

public record AdminOrderItemResponse(
        Long productId,
        String productName,
        Integer quantity,
        Double unitPrice,
        Double subtotal
) {
}

package com.purrfectmarket.dto;

import java.time.Instant;
import java.util.List;

public record AdminOrderResponse(
        Long id,
        Long userId,
        String customerEmail,
        String customerName,
        String orderStatus,
        String paymentStatus,
        String shippingStatus,
        Double totalAmount,
        Instant createdAt,
        List<AdminOrderItemResponse> items
) {
}

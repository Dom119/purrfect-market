package com.purrfectmarket.dto;

import java.time.Instant;

public record CheckoutCompletionResponse(
        Long orderId,
        Double totalAmount,
        String paymentStatus,
        String shippingStatus,
        Instant createdAt
) {
}

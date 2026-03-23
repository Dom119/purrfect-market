package com.purrfectmarket.dto;

import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        String status,
        Double totalAmount,
        Instant createdAt,
        List<OrderItemResponse> items
) {
}

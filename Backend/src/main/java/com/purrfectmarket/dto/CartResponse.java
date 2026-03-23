package com.purrfectmarket.dto;

import java.util.List;

public record CartResponse(
        List<CartItemResponse> items,
        Double subtotal,
        int itemCount
) {
}

package com.purrfectmarket.dto;

import java.time.Instant;

public record PendingReviewResponse(
        Long id,
        Long productId,
        String productName,
        String authorName,
        String authorEmail,
        int rating,
        String title,
        String body,
        Instant submittedAt
) {}

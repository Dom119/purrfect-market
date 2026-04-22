package com.purrfectmarket.dto;

import java.time.Instant;

public record ReviewResponse(
        Long id,
        String authorName,
        int rating,
        String title,
        String body,
        Instant createdAt
) {}

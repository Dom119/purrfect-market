package com.purrfectmarket.dto;

import java.time.Instant;
import java.util.List;

public record BroadcastLogResponse(
        Long id,
        String subject,
        String htmlBody,
        List<String> recipients,
        int sentCount,
        int failedCount,
        Instant sentAt
) {}

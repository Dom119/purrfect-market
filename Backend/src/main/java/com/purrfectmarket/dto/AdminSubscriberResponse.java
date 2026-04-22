package com.purrfectmarket.dto;

import java.time.Instant;

public record AdminSubscriberResponse(Long id, String email, Instant subscribedAt, boolean isUser, String userName) {
}

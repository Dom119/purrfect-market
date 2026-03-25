package com.purrfectmarket.dto;

import java.util.List;

public record NewsletterBroadcastRequest(String subject, String htmlBody, List<String> recipientEmails) {
}

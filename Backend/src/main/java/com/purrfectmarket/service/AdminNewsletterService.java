package com.purrfectmarket.service;

import com.purrfectmarket.dto.AdminSubscriberResponse;
import com.purrfectmarket.dto.NewsletterBroadcastRequest;
import com.purrfectmarket.repository.NewsletterSubscriberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminNewsletterService {

    private final NewsletterSubscriberRepository subscriberRepository;
    private final ResendEmailService resendEmailService;

    public AdminNewsletterService(
            NewsletterSubscriberRepository subscriberRepository,
            ResendEmailService resendEmailService) {
        this.subscriberRepository = subscriberRepository;
        this.resendEmailService = resendEmailService;
    }

    @Transactional(readOnly = true)
    public List<AdminSubscriberResponse> listSubscribers() {
        return subscriberRepository.findAllByOrderBySubscribedAtDesc().stream()
                .map(s -> new AdminSubscriberResponse(s.getId(), s.getEmail(), s.getSubscribedAt()))
                .toList();
    }

    public ResendEmailService.BroadcastResult broadcast(NewsletterBroadcastRequest request) {
        if (request.subject() == null || request.subject().isBlank()) {
            throw new IllegalArgumentException("Subject is required");
        }
        if (request.htmlBody() == null || request.htmlBody().isBlank()) {
            throw new IllegalArgumentException("Email body is required");
        }
        if (request.recipientEmails() == null || request.recipientEmails().isEmpty()) {
            throw new IllegalArgumentException("Select at least one subscriber");
        }
        Set<String> allowed = subscriberRepository.findAllByOrderBySubscribedAtDesc().stream()
                .map(s -> s.getEmail().toLowerCase())
                .collect(Collectors.toSet());
        List<String> toSend = request.recipientEmails().stream()
                .map(e -> e == null ? "" : e.trim().toLowerCase())
                .filter(e -> !e.isEmpty())
                .filter(allowed::contains)
                .distinct()
                .toList();
        if (toSend.isEmpty()) {
            throw new IllegalArgumentException("No valid subscribers in your selection");
        }
        return resendEmailService.sendHtmlBulk(toSend, request.subject().trim(), request.htmlBody());
    }
}

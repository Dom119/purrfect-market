package com.purrfectmarket.service;

import com.purrfectmarket.dto.AdminSubscriberResponse;
import com.purrfectmarket.dto.BroadcastLogResponse;
import com.purrfectmarket.dto.NewsletterBroadcastRequest;
import com.purrfectmarket.model.NewsletterBroadcastLog;
import com.purrfectmarket.model.User;
import com.purrfectmarket.repository.NewsletterBroadcastLogRepository;
import com.purrfectmarket.repository.NewsletterSubscriberRepository;
import com.purrfectmarket.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminNewsletterService {

    private final NewsletterSubscriberRepository subscriberRepository;
    private final UserRepository userRepository;
    private final NewsletterBroadcastLogRepository broadcastLogRepository;
    private final ResendEmailService resendEmailService;

    public AdminNewsletterService(
            NewsletterSubscriberRepository subscriberRepository,
            UserRepository userRepository,
            NewsletterBroadcastLogRepository broadcastLogRepository,
            ResendEmailService resendEmailService) {
        this.subscriberRepository = subscriberRepository;
        this.userRepository = userRepository;
        this.broadcastLogRepository = broadcastLogRepository;
        this.resendEmailService = resendEmailService;
    }

    @Transactional(readOnly = true)
    public List<AdminSubscriberResponse> listSubscribers() {
        Map<String, User> usersByEmail = userRepository.findAll().stream()
                .collect(Collectors.toMap(u -> u.getEmail().toLowerCase(), u -> u, (a, b) -> a));
        return subscriberRepository.findAllByOrderBySubscribedAtDesc().stream()
                .map(s -> {
                    User u = usersByEmail.get(s.getEmail().toLowerCase());
                    return new AdminSubscriberResponse(s.getId(), s.getEmail(), s.getSubscribedAt(), u != null, u != null ? u.getName() : null);
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BroadcastLogResponse> listHistory() {
        return broadcastLogRepository.findAllByOrderBySentAtDesc().stream()
                .map(l -> new BroadcastLogResponse(
                        l.getId(), l.getSubject(), l.getHtmlBody(),
                        l.getRecipients(), l.getSentCount(), l.getFailedCount(), l.getSentAt()))
                .toList();
    }

    @Transactional
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
        ResendEmailService.BroadcastResult result = resendEmailService.sendHtmlBulk(toSend, request.subject().trim(), request.htmlBody());
        broadcastLogRepository.save(new NewsletterBroadcastLog(
                request.subject().trim(), request.htmlBody(), toSend, result.sent(), result.failed()));
        return result;
    }
}

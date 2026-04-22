package com.purrfectmarket.service;

import com.purrfectmarket.model.NewsletterSubscriber;
import com.purrfectmarket.repository.NewsletterSubscriberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NewsletterService {

    private static final int MAX_EMAIL_LEN = 254;

    private final NewsletterSubscriberRepository repository;
    private final ResendEmailService resendEmailService;

    public NewsletterService(NewsletterSubscriberRepository repository, ResendEmailService resendEmailService) {
        this.repository = repository;
        this.resendEmailService = resendEmailService;
    }

    public boolean isSubscribed(String email) {
        if (email == null) return false;
        return repository.existsByEmail(email.trim().toLowerCase());
    }

    @Transactional
    public void unsubscribe(String rawEmail) {
        if (rawEmail == null) return;
        String email = rawEmail.trim().toLowerCase();
        repository.findByEmail(email).ifPresent(repository::delete);
    }

    @Transactional
    public String subscribe(String rawEmail) {
        if (rawEmail == null) {
            throw new IllegalArgumentException("Email is required");
        }
        String email = rawEmail.trim().toLowerCase();
        if (email.isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (email.length() > MAX_EMAIL_LEN) {
            throw new IllegalArgumentException("Email is too long");
        }
        if (!email.contains("@") || email.indexOf('@') == 0 || email.endsWith("@")) {
            throw new IllegalArgumentException("Please enter a valid email address");
        }

        if (repository.existsByEmail(email)) {
            return "You're already subscribed — thanks for being part of the club!";
        }

        repository.save(new NewsletterSubscriber(email));
        resendEmailService.sendWelcomeEmail(email);
        return "Thanks for subscribing! Check your inbox for your welcome offer.";
    }
}

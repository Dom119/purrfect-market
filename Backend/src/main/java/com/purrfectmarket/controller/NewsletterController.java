package com.purrfectmarket.controller;

import com.purrfectmarket.dto.NewsletterSubscribeRequest;
import com.purrfectmarket.service.NewsletterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {

    private final NewsletterService newsletterService;

    public NewsletterController(NewsletterService newsletterService) {
        this.newsletterService = newsletterService;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, String>> subscribe(@RequestBody NewsletterSubscribeRequest body) {
        String message = newsletterService.subscribe(body.email());
        return ResponseEntity.ok(Map.of("message", message));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> status(@RequestParam String email) {
        return ResponseEntity.ok(Map.of("subscribed", newsletterService.isSubscribed(email)));
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<Map<String, String>> unsubscribe(@RequestBody NewsletterSubscribeRequest body) {
        newsletterService.unsubscribe(body.email());
        return ResponseEntity.ok(Map.of("message", "You've been unsubscribed."));
    }
}

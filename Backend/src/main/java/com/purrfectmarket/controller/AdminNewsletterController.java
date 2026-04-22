package com.purrfectmarket.controller;

import com.purrfectmarket.dto.AdminSubscriberResponse;
import com.purrfectmarket.dto.BroadcastLogResponse;
import com.purrfectmarket.dto.NewsletterBroadcastRequest;
import com.purrfectmarket.service.AdminNewsletterService;
import com.purrfectmarket.service.ResendEmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminNewsletterController {

    private final AdminNewsletterService adminNewsletterService;

    public AdminNewsletterController(AdminNewsletterService adminNewsletterService) {
        this.adminNewsletterService = adminNewsletterService;
    }

    @GetMapping("/subscribers")
    public ResponseEntity<List<AdminSubscriberResponse>> listSubscribers() {
        return ResponseEntity.ok(adminNewsletterService.listSubscribers());
    }

    @GetMapping("/newsletter/history")
    public ResponseEntity<List<BroadcastLogResponse>> history() {
        return ResponseEntity.ok(adminNewsletterService.listHistory());
    }

    @PostMapping("/newsletter/broadcast")
    public ResponseEntity<Map<String, Object>> broadcast(@RequestBody NewsletterBroadcastRequest body) {
        ResendEmailService.BroadcastResult result = adminNewsletterService.broadcast(body);
        return ResponseEntity.ok(Map.of(
                "sent", result.sent(),
                "failed", result.failed(),
                "message", "Broadcast finished: " + result.sent() + " sent, " + result.failed() + " failed"
        ));
    }
}

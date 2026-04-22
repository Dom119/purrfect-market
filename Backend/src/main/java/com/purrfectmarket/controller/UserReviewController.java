package com.purrfectmarket.controller;

import com.purrfectmarket.dto.AuthResponse;
import com.purrfectmarket.dto.ReviewSubmitRequest;
import com.purrfectmarket.service.ReviewSubmissionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class UserReviewController {

    private final ReviewSubmissionService reviewSubmissionService;

    public UserReviewController(ReviewSubmissionService reviewSubmissionService) {
        this.reviewSubmissionService = reviewSubmissionService;
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Map<String, String>> submit(
            @PathVariable Long productId,
            @RequestBody ReviewSubmitRequest body,
            HttpServletRequest request) {
        AuthResponse user = getSessionUser(request);
        try {
            reviewSubmissionService.submit(user, productId, body);
            return ResponseEntity.ok(Map.of("message", "Your review has been submitted and is pending approval. Thank you!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private AuthResponse getSessionUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            throw new IllegalStateException("Must be logged in");
        }
        return (AuthResponse) session.getAttribute("user");
    }
}

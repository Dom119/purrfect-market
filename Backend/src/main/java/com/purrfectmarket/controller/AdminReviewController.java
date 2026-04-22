package com.purrfectmarket.controller;

import com.purrfectmarket.dto.PendingReviewResponse;
import com.purrfectmarket.service.AdminReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/reviews")
public class AdminReviewController {

    private final AdminReviewService adminReviewService;

    public AdminReviewController(AdminReviewService adminReviewService) {
        this.adminReviewService = adminReviewService;
    }

    @GetMapping("/pending")
    public ResponseEntity<List<PendingReviewResponse>> listPending() {
        return ResponseEntity.ok(adminReviewService.listPending());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Map<String, String>> approve(@PathVariable Long id) {
        try {
            adminReviewService.approve(id);
            return ResponseEntity.ok(Map.of("message", "Review approved and published"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> reject(@PathVariable Long id) {
        try {
            adminReviewService.reject(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

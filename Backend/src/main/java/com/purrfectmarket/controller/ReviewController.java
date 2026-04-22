package com.purrfectmarket.controller;

import com.purrfectmarket.dto.ReviewResponse;
import com.purrfectmarket.repository.ReviewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ReviewController {

    private final ReviewRepository reviewRepository;

    public ReviewController(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ReviewResponse>> getReviews(@PathVariable Long id) {
        List<ReviewResponse> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(id)
                .stream()
                .map(r -> new ReviewResponse(r.getId(), r.getAuthorName(), r.getRating(), r.getTitle(), r.getBody(), r.getCreatedAt()))
                .toList();
        return ResponseEntity.ok(reviews);
    }
}

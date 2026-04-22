package com.purrfectmarket.service;

import com.purrfectmarket.dto.PendingReviewResponse;
import com.purrfectmarket.model.PendingReview;
import com.purrfectmarket.model.Review;
import com.purrfectmarket.repository.PendingReviewRepository;
import com.purrfectmarket.repository.ProductRepository;
import com.purrfectmarket.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class AdminReviewService {

    private final PendingReviewRepository pendingReviewRepository;
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public AdminReviewService(
            PendingReviewRepository pendingReviewRepository,
            ReviewRepository reviewRepository,
            ProductRepository productRepository) {
        this.pendingReviewRepository = pendingReviewRepository;
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<PendingReviewResponse> listPending() {
        return pendingReviewRepository.findAllByOrderBySubmittedAtDesc().stream()
                .map(r -> new PendingReviewResponse(
                        r.getId(), r.getProductId(), r.getProductName(),
                        r.getAuthorName(), r.getAuthorEmail(),
                        r.getRating(), r.getTitle(), r.getBody(), r.getSubmittedAt()))
                .toList();
    }

    @Transactional
    public void approve(Long pendingId) {
        PendingReview pending = pendingReviewRepository.findById(pendingId)
                .orElseThrow(() -> new IllegalArgumentException("Pending review not found"));

        reviewRepository.save(new Review(
                pending.getProductId(), pending.getAuthorName(),
                pending.getRating(), pending.getTitle(), pending.getBody(),
                Instant.now()));

        productRepository.findById(pending.getProductId()).ifPresent(product -> {
            double oldRating = product.getRating() != null ? product.getRating() : 0;
            int oldCount = product.getReviewCount() != null ? product.getReviewCount() : 0;
            int newCount = oldCount + 1;
            double newRating = Math.round(((oldRating * oldCount + pending.getRating()) / newCount) * 10.0) / 10.0;
            product.setRating(newRating);
            product.setReviewCount(newCount);
            productRepository.save(product);
        });

        pendingReviewRepository.delete(pending);
    }

    @Transactional
    public void reject(Long pendingId) {
        PendingReview pending = pendingReviewRepository.findById(pendingId)
                .orElseThrow(() -> new IllegalArgumentException("Pending review not found"));
        pendingReviewRepository.delete(pending);
    }
}

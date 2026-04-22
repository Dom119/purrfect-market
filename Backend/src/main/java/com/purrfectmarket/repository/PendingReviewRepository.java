package com.purrfectmarket.repository;

import com.purrfectmarket.model.PendingReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PendingReviewRepository extends JpaRepository<PendingReview, Long> {
    List<PendingReview> findAllByOrderBySubmittedAtDesc();
}

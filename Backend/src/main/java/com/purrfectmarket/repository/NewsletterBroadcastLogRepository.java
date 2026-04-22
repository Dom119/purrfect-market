package com.purrfectmarket.repository;

import com.purrfectmarket.model.NewsletterBroadcastLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NewsletterBroadcastLogRepository extends JpaRepository<NewsletterBroadcastLog, Long> {
    List<NewsletterBroadcastLog> findAllByOrderBySentAtDesc();
}

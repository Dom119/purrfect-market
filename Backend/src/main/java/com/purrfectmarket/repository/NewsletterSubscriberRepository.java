package com.purrfectmarket.repository;

import com.purrfectmarket.model.NewsletterSubscriber;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NewsletterSubscriberRepository extends JpaRepository<NewsletterSubscriber, Long> {

    boolean existsByEmail(String email);

    java.util.Optional<com.purrfectmarket.model.NewsletterSubscriber> findByEmail(String email);

    List<NewsletterSubscriber> findAllByOrderBySubscribedAtDesc();
}

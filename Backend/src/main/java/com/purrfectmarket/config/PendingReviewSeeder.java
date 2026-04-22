package com.purrfectmarket.config;

import com.purrfectmarket.model.PendingReview;
import com.purrfectmarket.repository.PendingReviewRepository;
import com.purrfectmarket.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@Order(3)
public class PendingReviewSeeder implements CommandLineRunner {

    private final PendingReviewRepository pendingReviewRepository;
    private final ProductRepository productRepository;

    public PendingReviewSeeder(PendingReviewRepository pendingReviewRepository,
                               ProductRepository productRepository) {
        this.pendingReviewRepository = pendingReviewRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (pendingReviewRepository.count() > 0) return;

        Map<String, Long> idByName = productRepository.findAll().stream()
                .collect(Collectors.toMap(p -> p.getName(), p -> p.getId(), (a, b) -> a));

        List<PendingReview> seeds = List.of(
            new PendingReview(
                idByName.getOrDefault("Organic Salmon Feast", 1L), "Organic Salmon Feast",
                99L, "Jessica T.", "jessica.t@example.com",
                5, "Absolutely love this food",
                "My cat was always leaving half her bowl before I switched to this. Now she finishes every meal and looks so much healthier. The coat is shinier and she seems so much more energetic. Will definitely keep buying."
            ),
            new PendingReview(
                idByName.getOrDefault("Feather Wand Toy", 2L), "Feather Wand Toy",
                100L, "Marcus B.", "marcus.b@example.com",
                4, "Great toy but feathers wear fast",
                "My two cats go absolutely crazy for this. The quality feels solid and the wand is a good length. Only reason I'm not giving five stars is the feathers started fraying after about three weeks of daily play. Still buying another one though."
            ),
            new PendingReview(
                idByName.getOrDefault("Cozy Cave Bed", 3L), "Cozy Cave Bed",
                101L, "Priya S.", "priya.s@example.com",
                5, "My anxious rescue loves hiding in this",
                "Adopted a very shy cat six months ago. She would hide under the sofa all day. Since getting this cave bed she comes out and sits in it in the living room. Such a huge improvement in her confidence. The material is so soft too."
            ),
            new PendingReview(
                idByName.getOrDefault("Slicker Brush", 8L), "Slicker Brush",
                102L, "Daniel W.", "daniel.w@example.com",
                5, "Transformed grooming sessions completely",
                "My Maine Coon used to struggle with tangles and hated being brushed. This brush is gentle enough that he doesn't fight it and effective enough to get through his thick coat in one pass. He actually purrs now when I groom him."
            ),
            new PendingReview(
                idByName.getOrDefault("Laser Pointer Toy", 6L), "Laser Pointer Toy",
                103L, "Amelia R.", "amelia.r@example.com",
                3, "Fun but my older cat lost interest quickly",
                "My kitten is obsessed with it which is great. My older cat showed interest for about a week and then completely ignored it after that. Worth it for the kitten alone but just be aware results may vary depending on your cat's age and personality."
            ),
            new PendingReview(
                idByName.getOrDefault("Tuna & Chicken Pate", 5L), "Tuna & Chicken Pate",
                104L, "Noah K.", "noah.k@example.com",
                5, "Finally got my dry-food-only cat to eat wet food",
                "Tried six different wet food brands over two years. My cat refused all of them. Tried this on a whim and he ate the entire pouch in under two minutes. I was stunned. The texture and smell must be just right. Ordered a full case immediately."
            )
        );

        pendingReviewRepository.saveAll(seeds);
    }
}

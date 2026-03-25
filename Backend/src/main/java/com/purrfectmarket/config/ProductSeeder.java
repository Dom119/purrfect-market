package com.purrfectmarket.config;

import com.purrfectmarket.dto.ProductRequest;
import com.purrfectmarket.repository.ProductRepository;
import com.purrfectmarket.service.ProductService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final ProductService productService;

    public ProductSeeder(ProductRepository productRepository, ProductService productService) {
        this.productRepository = productRepository;
        this.productService = productService;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            return;
        }

        List<ProductRequest> products = List.of(
                new ProductRequest(
                        "Organic Salmon Feast",
                        "Premium grain-free cat food with wild-caught salmon. Rich in omega fatty acids for a healthy coat.",
                        34.99,
                        "Food & Treats",
                        "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop",
                        4.9,
                        128,
                        "New",
                        true,
                        120
                ),
                new ProductRequest(
                        "Feather Wand Toy",
                        "Interactive wand toy with natural feathers. Perfect for bonding and exercise.",
                        12.99,
                        "Toys",
                        "https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=400&h=400&fit=crop",
                        4.8,
                        256,
                        "Sale",
                        false,
                        200
                ),
                new ProductRequest(
                        "Cozy Cave Bed",
                        "Soft, plush cave bed for cats who love to hide. Machine washable cover.",
                        49.99,
                        "Beds",
                        "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop",
                        4.7,
                        89,
                        null,
                        true,
                        60
                ),
                new ProductRequest(
                        "Dental Chew Sticks",
                        "Natural dental treats that help reduce tartar and freshen breath.",
                        18.99,
                        "Grooming",
                        "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=400&fit=crop",
                        4.9,
                        312,
                        null,
                        true,
                        400
                ),
                new ProductRequest(
                        "Tuna & Chicken Pate",
                        "Wet food pate with real tuna and chicken. No artificial flavors.",
                        24.99,
                        "Food & Treats",
                        "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop",
                        4.8,
                        445,
                        null,
                        true,
                        300
                ),
                new ProductRequest(
                        "Laser Pointer Toy",
                        "Red dot laser for endless chase fun. Battery operated with multiple patterns.",
                        9.99,
                        "Toys",
                        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
                        4.6,
                        203,
                        null,
                        false,
                        150
                ),
                new ProductRequest(
                        "Window Perch",
                        "Suction-mounted perch for window watching. Supports up to 50 lbs.",
                        39.99,
                        "Beds",
                        "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop",
                        4.8,
                        167,
                        "New",
                        true,
                        75
                ),
                new ProductRequest(
                        "Slicker Brush",
                        "Gentle bristles for removing loose fur and preventing mats.",
                        14.99,
                        "Grooming",
                        "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=400&fit=crop",
                        4.9,
                        278,
                        null,
                        true,
                        250
                )
        );

        for (ProductRequest request : products) {
            productService.createProduct(request);
        }
    }
}

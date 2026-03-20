package com.purrfectmarket.service;

import com.purrfectmarket.dto.ProductResponse;
import com.purrfectmarket.model.Favorite;
import com.purrfectmarket.model.Product;
import com.purrfectmarket.repository.FavoriteRepository;
import com.purrfectmarket.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, ProductRepository productRepository) {
        this.favoriteRepository = favoriteRepository;
        this.productRepository = productRepository;
    }

    public List<ProductResponse> getFavorites(Long userId) {
        return favoriteRepository.findByUserIdOrderByIdDesc(userId).stream()
                .map(f -> toProductResponse(f.getProduct()))
                .toList();
    }

    public Set<Long> getFavoriteProductIds(Long userId) {
        return favoriteRepository.findByUserIdOrderByIdDesc(userId).stream()
                .map(f -> f.getProduct().getId())
                .collect(Collectors.toSet());
    }

    public ProductResponse addFavorite(Long userId, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));
        if (favoriteRepository.existsByUserIdAndProductId(userId, productId)) {
            return toProductResponse(product);
        }
        Favorite favorite = new Favorite(userId, product);
        favoriteRepository.save(favorite);
        return toProductResponse(product);
    }

    public void removeFavorite(Long userId, Long productId) {
        favoriteRepository.deleteByUserIdAndProductId(userId, productId);
    }

    public boolean isFavorite(Long userId, Long productId) {
        return favoriteRepository.existsByUserIdAndProductId(userId, productId);
    }

    private ProductResponse toProductResponse(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getCategory(),
                p.getImageUrl(),
                p.getRating(),
                p.getReviewCount(),
                p.getBadge(),
                p.getInStock() != null ? p.getInStock() : true
        );
    }
}

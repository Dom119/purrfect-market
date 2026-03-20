package com.purrfectmarket.service;

import com.purrfectmarket.dto.ProductRequest;
import com.purrfectmarket.dto.ProductResponse;
import com.purrfectmarket.model.Product;
import com.purrfectmarket.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product(
                request.name(),
                request.description(),
                request.price(),
                request.category(),
                request.imageUrl(),
                request.rating(),
                request.reviewCount(),
                request.badge(),
                request.inStock()
        );
        product = productRepository.save(product);
        return toResponse(product);
    }

    private ProductResponse toResponse(Product p) {
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
                p.getInStock()
        );
    }
}

package com.purrfectmarket.service;

import com.purrfectmarket.dto.AdminProductResponse;
import com.purrfectmarket.dto.ProductRequest;
import com.purrfectmarket.dto.ProductResponse;
import com.purrfectmarket.model.Product;
import com.purrfectmarket.repository.ProductRepository;
import com.purrfectmarket.util.ProductUrls;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductResponse createProduct(ProductRequest request) {
        int inv = request.inventory() != null ? request.inventory() : 100;
        Product product = new Product(
                request.name(),
                request.description(),
                request.price(),
                request.category(),
                request.imageUrl(),
                request.rating(),
                request.reviewCount(),
                request.badge(),
                request.inStock(),
                inv
        );
        product = productRepository.save(product);
        return toResponse(product);
    }

    public ProductResponse toResponse(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getCategory(),
                ProductUrls.publicImageUrl(p),
                p.getRating(),
                p.getReviewCount(),
                p.getBadge(),
                p.getInStock() != null ? p.getInStock() : true
        );
    }

    public AdminProductResponse toAdminResponse(Product p) {
        boolean hasBlob = p.getImageData() != null && p.getImageData().length > 0;
        return new AdminProductResponse(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getCategory(),
                ProductUrls.publicImageUrl(p),
                hasBlob,
                p.getRating(),
                p.getReviewCount(),
                p.getBadge(),
                p.getInStock() != null ? p.getInStock() : true,
                p.getInventoryQuantity() != null ? p.getInventoryQuantity() : 0
        );
    }
}

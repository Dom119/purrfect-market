package com.purrfectmarket.service;

import com.purrfectmarket.dto.AdminProductResponse;
import com.purrfectmarket.dto.UpdateInventoryRequest;
import com.purrfectmarket.model.Product;
import com.purrfectmarket.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class AdminProductService {

    private final ProductRepository productRepository;
    private final ProductService productService;

    public AdminProductService(ProductRepository productRepository, ProductService productService) {
        this.productRepository = productRepository;
        this.productService = productService;
    }

    @Transactional(readOnly = true)
    public List<AdminProductResponse> listAll() {
        return productRepository.findAllByOrderByNameAsc().stream()
                .map(productService::toAdminResponse)
                .toList();
    }

    @Transactional
    public AdminProductResponse updateInventory(Long productId, UpdateInventoryRequest request) {
        if (request.inventoryQuantity() == null || request.inventoryQuantity() < 0) {
            throw new IllegalArgumentException("inventoryQuantity must be >= 0");
        }
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        p.setInventoryQuantity(request.inventoryQuantity());
        p.setInStock(request.inventoryQuantity() > 0);
        p = productRepository.save(p);
        return productService.toAdminResponse(p);
    }

    @Transactional
    public void deleteProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new IllegalArgumentException("Product not found");
        }
        productRepository.deleteById(productId);
    }

    @Transactional
    public AdminProductResponse updateProduct(
            Long productId,
            String name,
            String description,
            double price,
            String category,
            int inventory,
            String imageUrl,
            Double rating,
            Integer reviewCount,
            String badge,
            Boolean inStock,
            MultipartFile imageFile) throws IOException {

        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (name == null || name.isBlank()) throw new IllegalArgumentException("Name is required");
        if (category == null || category.isBlank()) throw new IllegalArgumentException("Category is required");

        p.setName(name.trim());
        p.setDescription(description != null ? description : "");
        p.setPrice(price);
        p.setCategory(category.trim());
        p.setImageUrl(imageUrl != null && !imageUrl.isBlank() ? imageUrl.trim() : null);
        p.setRating(rating);
        p.setReviewCount(reviewCount);
        p.setBadge(badge);
        p.setInStock(inStock != null ? inStock : inventory > 0);
        p.setInventoryQuantity(Math.max(0, inventory));

        if (imageFile != null && !imageFile.isEmpty()) {
            p.setImageData(imageFile.getBytes());
            String ct = imageFile.getContentType();
            p.setImageContentType(ct != null && !ct.isBlank() ? ct : "image/jpeg");
        }

        p = productRepository.save(p);
        return productService.toAdminResponse(p);
    }

    @Transactional
    public AdminProductResponse createProduct(
            String name,
            String description,
            double price,
            String category,
            int inventory,
            String imageUrl,
            Double rating,
            Integer reviewCount,
            String badge,
            Boolean inStock,
            MultipartFile imageFile) throws IOException {

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (category == null || category.isBlank()) {
            throw new IllegalArgumentException("Category is required");
        }

        Product p = new Product(
                name.trim(),
                description != null ? description : "",
                price,
                category.trim(),
                imageUrl != null && !imageUrl.isBlank() ? imageUrl.trim() : null,
                rating,
                reviewCount,
                badge,
                inStock != null ? inStock : true,
                Math.max(0, inventory)
        );

        if (imageFile != null && !imageFile.isEmpty()) {
            p.setImageData(imageFile.getBytes());
            String ct = imageFile.getContentType();
            p.setImageContentType(ct != null && !ct.isBlank() ? ct : "image/jpeg");
        }

        p = productRepository.save(p);
        return productService.toAdminResponse(p);
    }
}

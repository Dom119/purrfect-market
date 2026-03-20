package com.purrfectmarket.controller;

import com.purrfectmarket.dto.ProductRequest;
import com.purrfectmarket.dto.ProductResponse;
import com.purrfectmarket.model.Product;
import com.purrfectmarket.repository.ProductRepository;
import com.purrfectmarket.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final ProductService productService;

    public ProductController(ProductRepository productRepository, ProductService productService) {
        this.productRepository = productRepository;
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> listProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        List<Product> products;
        boolean hasCategory = category != null && !category.isBlank();
        boolean hasSearch = search != null && !search.isBlank();

        if (hasCategory && hasSearch) {
            products = productRepository.findByCategoryAndNameContainingIgnoreCaseOrderByNameAsc(category, search);
        } else if (hasSearch) {
            products = productRepository.findByNameContainingIgnoreCaseOrderByNameAsc(search);
        } else if (hasCategory) {
            products = productRepository.findByCategoryOrderByNameAsc(category);
        } else {
            products = productRepository.findAllByOrderByNameAsc();
        }

        List<ProductResponse> response = products.stream()
                .map(p -> new ProductResponse(
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
                ))
                .toList();

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductRequest request) {
        ProductResponse created = productService.createProduct(request);
        return ResponseEntity.status(201).body(created);
    }
}

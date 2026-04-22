package com.purrfectmarket.controller;

import com.purrfectmarket.dto.ProductResponse;
import com.purrfectmarket.model.Product;
import com.purrfectmarket.repository.ProductRepository;
import com.purrfectmarket.service.ProductService;
import org.springframework.http.MediaType;
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

    @GetMapping("/categories")
    public ResponseEntity<List<String>> listCategories() {
        return ResponseEntity.ok(productRepository.findDistinctCategories());
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
                .map(productService::toResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(productService::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable Long id) {
        Product p = productRepository.findById(id).orElse(null);
        if (p == null || p.getImageData() == null || p.getImageData().length == 0) {
            return ResponseEntity.notFound().build();
        }
        String ct = p.getImageContentType() != null ? p.getImageContentType() : MediaType.IMAGE_JPEG_VALUE;
        MediaType mediaType = MediaType.parseMediaType(ct);
        return ResponseEntity.ok().contentType(mediaType).body(p.getImageData());
    }
}

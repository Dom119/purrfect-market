package com.purrfectmarket.controller;

import com.purrfectmarket.dto.AdminProductResponse;
import com.purrfectmarket.dto.UpdateInventoryRequest;
import com.purrfectmarket.service.AdminProductService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final AdminProductService adminProductService;

    public AdminProductController(AdminProductService adminProductService) {
        this.adminProductService = adminProductService;
    }

    @GetMapping
    public ResponseEntity<List<AdminProductResponse>> listAll() {
        return ResponseEntity.ok(adminProductService.listAll());
    }

    @PatchMapping("/{id}/inventory")
    public ResponseEntity<AdminProductResponse> updateInventory(
            @PathVariable Long id,
            @RequestBody UpdateInventoryRequest body) {
        return ResponseEntity.ok(adminProductService.updateInventory(id, body));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AdminProductResponse> createProduct(
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam double price,
            @RequestParam String category,
            @RequestParam(defaultValue = "0") int inventory,
            @RequestParam(required = false) String imageUrl,
            @RequestParam(required = false) Double rating,
            @RequestParam(required = false) Integer reviewCount,
            @RequestParam(required = false) String badge,
            @RequestParam(required = false) Boolean inStock,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {
        AdminProductResponse created = adminProductService.createProduct(
                name,
                description,
                price,
                category,
                inventory,
                imageUrl,
                rating,
                reviewCount,
                badge,
                inStock,
                image
        );
        return ResponseEntity.status(201).body(created);
    }
}

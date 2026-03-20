package com.purrfectmarket.controller;

import com.purrfectmarket.dto.AuthResponse;
import com.purrfectmarket.dto.ProductResponse;
import com.purrfectmarket.service.FavoriteService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    private Long getUserId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            throw new IllegalStateException("User must be logged in");
        }
        AuthResponse user = (AuthResponse) session.getAttribute("user");
        if (user.id() == null) {
            throw new IllegalStateException("User must be logged in");
        }
        return user.id();
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getFavorites(HttpServletRequest request) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(favoriteService.getFavorites(userId));
    }

    @GetMapping("/ids")
    public ResponseEntity<Set<Long>> getFavoriteIds(HttpServletRequest request) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(favoriteService.getFavoriteProductIds(userId));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<ProductResponse> addFavorite(
            @PathVariable Long productId,
            HttpServletRequest request) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(favoriteService.addFavorite(userId, productId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable Long productId,
            HttpServletRequest request) {
        Long userId = getUserId(request);
        favoriteService.removeFavorite(userId, productId);
        return ResponseEntity.noContent().build();
    }
}

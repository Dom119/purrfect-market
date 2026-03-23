package com.purrfectmarket.controller;

import com.purrfectmarket.dto.AddToCartRequest;
import com.purrfectmarket.dto.AuthResponse;
import com.purrfectmarket.dto.CartItemResponse;
import com.purrfectmarket.dto.CartResponse;
import com.purrfectmarket.dto.UpdateCartRequest;
import com.purrfectmarket.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
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
    public ResponseEntity<CartResponse> getCart(HttpServletRequest request) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/items")
    public ResponseEntity<CartItemResponse> addItem(@RequestBody AddToCartRequest request, HttpServletRequest httpRequest) {
        Long userId = getUserId(httpRequest);
        CartItemResponse response = cartService.addItem(
                userId,
                request.productId(),
                request.quantity() != null ? request.quantity() : 1
        );
        return ResponseEntity.ok(response);
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<CartItemResponse> updateItem(
            @PathVariable Long productId,
            @RequestBody UpdateCartRequest request,
            HttpServletRequest httpRequest) {
        Long userId = getUserId(httpRequest);
        CartItemResponse response = cartService.updateQuantity(userId, productId, request.quantity());
        return response != null ? ResponseEntity.ok(response) : ResponseEntity.noContent().build();
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long productId, HttpServletRequest request) {
        Long userId = getUserId(request);
        cartService.removeItem(userId, productId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/checkout")
    public ResponseEntity<Long> checkout(HttpServletRequest request) {
        Long userId = getUserId(request);
        Long orderId = cartService.checkout(userId).getId();
        return ResponseEntity.ok(orderId);
    }
}

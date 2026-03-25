package com.purrfectmarket.controller;

import com.purrfectmarket.dto.AddToCartRequest;
import com.purrfectmarket.dto.AuthResponse;
import com.purrfectmarket.dto.CartItemResponse;
import com.purrfectmarket.dto.CartResponse;
import com.purrfectmarket.dto.CheckoutCompletionResponse;
import com.purrfectmarket.dto.UpdateCartRequest;
import com.purrfectmarket.model.Order;
import com.purrfectmarket.service.CartService;
import com.purrfectmarket.service.StripeService;
import com.stripe.exception.StripeException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final StripeService stripeService;

    public CartController(CartService cartService, StripeService stripeService) {
        this.cartService = cartService;
        this.stripeService = stripeService;
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

    @PostMapping("/create-checkout-session")
    public ResponseEntity<CreateCheckoutSessionResponse> createCheckoutSession(HttpServletRequest request) {
        Long userId = getUserId(request);
        CartResponse cart = cartService.getCart(userId);
        if (cart.items().isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }
        long amountCents = (long) Math.round(cart.subtotal() * 100);
        if (amountCents < 50) {
            throw new IllegalStateException("Order total must be at least $0.50");
        }
        try {
            String url = stripeService.createCheckoutSession(userId, amountCents);
            return ResponseEntity.ok(new CreateCheckoutSessionResponse(url));
        } catch (StripeException e) {
            throw new RuntimeException("Failed to create checkout session: " + e.getMessage());
        }
    }

    @PostMapping("/complete-checkout")
    public ResponseEntity<CheckoutCompletionResponse> completeCheckout(
            @RequestBody CompleteCheckoutRequest body, HttpServletRequest request) {
        Long userId = getUserId(request);
        String sessionId = body.sessionId();
        if (sessionId == null || sessionId.isBlank()) {
            throw new IllegalArgumentException("sessionId is required");
        }
        try {
            if (!stripeService.isPaymentComplete(sessionId)) {
                throw new IllegalStateException("Payment was not completed");
            }
            String sessionUserId = stripeService.getSessionUserId(sessionId);
            if (!String.valueOf(userId).equals(sessionUserId)) {
                throw new IllegalStateException("Session does not match logged-in user");
            }
            Order order = cartService.checkout(userId);
            return ResponseEntity.ok(new CheckoutCompletionResponse(
                    order.getId(),
                    order.getTotalAmount(),
                    order.getPaymentStatus() != null ? order.getPaymentStatus().name() : Order.PaymentStatus.PAID.name(),
                    order.getShippingStatus() != null ? order.getShippingStatus().name() : Order.ShippingStatus.PREPARING.name(),
                    order.getCreatedAt()
            ));
        } catch (StripeException e) {
            throw new RuntimeException("Failed to verify payment: " + e.getMessage());
        }
    }

    public record CreateCheckoutSessionResponse(String url) {}
    public record CompleteCheckoutRequest(String sessionId) {}
}

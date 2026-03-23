package com.purrfectmarket.controller;

import com.purrfectmarket.dto.AuthResponse;
import com.purrfectmarket.dto.OrderResponse;
import com.purrfectmarket.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
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
    public ResponseEntity<List<OrderResponse>> getOrders(HttpServletRequest request) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long orderId, HttpServletRequest request) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(orderService.getOrder(orderId, userId));
    }
}

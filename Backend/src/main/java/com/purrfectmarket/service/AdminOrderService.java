package com.purrfectmarket.service;

import com.purrfectmarket.dto.AdminOrderItemResponse;
import com.purrfectmarket.dto.AdminOrderResponse;
import com.purrfectmarket.model.Order;
import com.purrfectmarket.model.User;
import com.purrfectmarket.repository.OrderRepository;
import com.purrfectmarket.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminOrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public AdminOrderService(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminOrderResponse> findAllOrders() {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        List<AdminOrderResponse> result = new ArrayList<>();
        for (Order o : orders) {
            User customer = userRepository.findById(o.getUserId()).orElse(null);
            String email = customer != null ? customer.getEmail() : "(unknown)";
            String name = customer != null ? customer.getName() : "—";
            List<AdminOrderItemResponse> items = o.getItems().stream()
                    .map(oi -> new AdminOrderItemResponse(
                            oi.getProduct().getId(),
                            oi.getProduct().getName(),
                            oi.getQuantity(),
                            oi.getUnitPrice(),
                            oi.getSubtotal()
                    ))
                    .toList();
            result.add(new AdminOrderResponse(
                    o.getId(),
                    o.getUserId(),
                    email,
                    name,
                    o.getStatus().name(),
                    o.getPaymentStatus() != null ? o.getPaymentStatus().name() : "PAID",
                    o.getShippingStatus() != null ? o.getShippingStatus().name() : "PREPARING",
                    o.getTotalAmount(),
                    o.getCreatedAt(),
                    items
            ));
        }
        return result;
    }
}

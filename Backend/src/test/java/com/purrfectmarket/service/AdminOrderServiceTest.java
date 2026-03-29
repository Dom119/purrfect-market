package com.purrfectmarket.service;

import com.purrfectmarket.model.Order;
import com.purrfectmarket.model.OrderItem;
import com.purrfectmarket.model.Product;
import com.purrfectmarket.model.User;
import com.purrfectmarket.repository.OrderRepository;
import com.purrfectmarket.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminOrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AdminOrderService adminOrderService;

    @Test
    void findAllOrders_joinsCustomerAndItems() {
        Product p = new Product("P", "d", 5.0, "c", null, null, null, null, true, 1);
        ReflectionTestUtils.setField(p, "id", 8L);
        Order o = new Order(3L, 15.0);
        ReflectionTestUtils.setField(o, "id", 100L);
        ReflectionTestUtils.setField(o, "createdAt", Instant.parse("2024-01-02T00:00:00Z"));
        o.addItem(new OrderItem(p, 1, 5.0));
        when(orderRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(o));

        User u = new User("cust@test.com", "h", "Cust");
        ReflectionTestUtils.setField(u, "id", 3L);
        when(userRepository.findById(3L)).thenReturn(Optional.of(u));

        var rows = adminOrderService.findAllOrders();

        assertThat(rows).hasSize(1);
        assertThat(rows.getFirst().customerEmail()).isEqualTo("cust@test.com");
        assertThat(rows.getFirst().items()).hasSize(1);
        assertThat(rows.getFirst().items().getFirst().productName()).isEqualTo("P");
    }

    @Test
    void findAllOrders_unknownCustomerUsesPlaceholder() {
        Order o = new Order(99L, 1.0);
        ReflectionTestUtils.setField(o, "id", 1L);
        when(orderRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(o));
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        var rows = adminOrderService.findAllOrders();

        assertThat(rows.getFirst().customerEmail()).isEqualTo("(unknown)");
        assertThat(rows.getFirst().customerName()).isEqualTo("—");
    }
}

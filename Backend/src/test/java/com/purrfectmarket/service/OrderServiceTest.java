package com.purrfectmarket.service;

import com.purrfectmarket.model.Order;
import com.purrfectmarket.model.OrderItem;
import com.purrfectmarket.model.Product;
import com.purrfectmarket.repository.OrderRepository;
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
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void getOrder_wrongUser_throws() {
        Order o = new Order(1L, 10.0);
        ReflectionTestUtils.setField(o, "id", 99L);
        when(orderRepository.findById(99L)).thenReturn(Optional.of(o));

        assertThatThrownBy(() -> orderService.getOrder(99L, 2L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("not found");
    }

    @Test
    void getOrder_returnsWhenOwner() {
        Product p = new Product("P", "d", 5.0, "c", null, null, null, null, true, 1);
        ReflectionTestUtils.setField(p, "id", 3L);
        Order o = new Order(1L, 10.0);
        ReflectionTestUtils.setField(o, "id", 10L);
        ReflectionTestUtils.setField(o, "createdAt", Instant.parse("2024-01-01T00:00:00Z"));
        o.addItem(new OrderItem(p, 2, 5.0));
        when(orderRepository.findById(10L)).thenReturn(Optional.of(o));

        var res = orderService.getOrder(10L, 1L);

        assertThat(res.id()).isEqualTo(10L);
        assertThat(res.items()).hasSize(1);
        assertThat(res.items().getFirst().productName()).isEqualTo("P");
    }

    @Test
    void getOrdersByUserId_mapsList() {
        Order o = new Order(5L, 12.0);
        ReflectionTestUtils.setField(o, "id", 1L);
        when(orderRepository.findByUserIdOrderByCreatedAtDesc(5L)).thenReturn(List.of(o));

        var list = orderService.getOrdersByUserId(5L);

        assertThat(list).hasSize(1);
        assertThat(list.getFirst().totalAmount()).isEqualTo(12.0);
    }
}

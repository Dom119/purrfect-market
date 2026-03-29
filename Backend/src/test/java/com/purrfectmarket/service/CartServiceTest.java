package com.purrfectmarket.service;

import com.purrfectmarket.model.CartItem;
import com.purrfectmarket.model.Order;
import com.purrfectmarket.model.Product;
import com.purrfectmarket.repository.CartItemRepository;
import com.purrfectmarket.repository.OrderRepository;
import com.purrfectmarket.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartItemRepository cartItemRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private CartService cartService;

    @Test
    void getCart_empty() {
        when(cartItemRepository.findByUserIdOrderByIdDesc(1L)).thenReturn(List.of());

        var cart = cartService.getCart(1L);

        assertThat(cart.items()).isEmpty();
        assertThat(cart.subtotal()).isZero();
        assertThat(cart.itemCount()).isZero();
    }

    @Test
    void addItem_productNotFound() {
        when(productRepository.findById(5L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cartService.addItem(1L, 5L, 1))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Product not found");
    }

    @Test
    void addItem_createsNewLine() {
        Product p = product(10L, "Cat Toy", 5.0, 3);
        when(productRepository.findById(10L)).thenReturn(Optional.of(p));
        when(cartItemRepository.findByUserIdAndProduct_Id(1L, 10L)).thenReturn(Optional.empty());
        CartItem saved = new CartItem(1L, p, 2);
        ReflectionTestUtils.setField(saved, "id", 100L);
        when(cartItemRepository.save(any(CartItem.class))).thenAnswer(inv -> inv.getArgument(0));

        var line = cartService.addItem(1L, 10L, 2);

        assertThat(line.quantity()).isEqualTo(2);
        assertThat(line.productId()).isEqualTo(10L);
        verify(cartItemRepository).save(any(CartItem.class));
    }

    @Test
    void addItem_mergesWithExisting() {
        Product p = product(10L, "Toy", 4.0, 10);
        when(productRepository.findById(10L)).thenReturn(Optional.of(p));
        CartItem existing = new CartItem(1L, p, 1);
        ReflectionTestUtils.setField(existing, "id", 50L);
        when(cartItemRepository.findByUserIdAndProduct_Id(1L, 10L)).thenReturn(Optional.of(existing));
        when(cartItemRepository.save(existing)).thenReturn(existing);

        var line = cartService.addItem(1L, 10L, 2);

        assertThat(line.quantity()).isEqualTo(3);
        verify(cartItemRepository).save(existing);
    }

    @Test
    void addItem_defaultQuantityOneWhenNull() {
        Product p = product(1L, "P", 1.0, 5);
        when(productRepository.findById(1L)).thenReturn(Optional.of(p));
        when(cartItemRepository.findByUserIdAndProduct_Id(2L, 1L)).thenReturn(Optional.empty());
        when(cartItemRepository.save(any(CartItem.class))).thenAnswer(inv -> inv.getArgument(0));

        cartService.addItem(2L, 1L, null);

        ArgumentCaptor<CartItem> cap = ArgumentCaptor.forClass(CartItem.class);
        verify(cartItemRepository).save(cap.capture());
        assertThat(cap.getValue().getQuantity()).isEqualTo(1);
    }

    @Test
    void addItem_throwsWhenExceedsStock() {
        Product p = product(1L, "P", 1.0, 2);
        when(productRepository.findById(1L)).thenReturn(Optional.of(p));
        when(cartItemRepository.findByUserIdAndProduct_Id(1L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cartService.addItem(1L, 1L, 5))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("in stock");
    }

    @Test
    void updateQuantity_removesWhenNotPositive() {
        Product p = product(1L, "P", 1.0, 5);
        CartItem item = new CartItem(1L, p, 2);
        when(cartItemRepository.findByUserIdAndProduct_Id(1L, 1L)).thenReturn(Optional.of(item));

        var res = cartService.updateQuantity(1L, 1L, 0);

        assertThat(res).isNull();
        verify(cartItemRepository).delete(item);
        verify(cartItemRepository, never()).save(any());
    }

    @Test
    void checkout_emptyCart() {
        when(cartItemRepository.findByUserIdOrderByIdDesc(1L)).thenReturn(List.of());

        assertThatThrownBy(() -> cartService.checkout(1L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("empty");
    }

    @Test
    void checkout_createsOrderAndClearsCart() {
        Product p = product(1L, "P", 10.0, 5);
        ReflectionTestUtils.setField(p, "inventoryQuantity", 5);
        CartItem ci = new CartItem(9L, p, 2);
        when(cartItemRepository.findByUserIdOrderByIdDesc(9L)).thenReturn(List.of(ci));
        when(productRepository.findById(1L)).thenReturn(Optional.of(p));
        Order order = new Order(9L, 20.0);
        ReflectionTestUtils.setField(order, "id", 200L);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        Order result = cartService.checkout(9L);

        assertThat(result.getTotalAmount()).isEqualTo(20.0);
        verify(cartItemRepository).deleteByUserId(9L);
        verify(productRepository).save(p);
        assertThat(p.getInventoryQuantity()).isEqualTo(3);
    }

    private static Product product(long id, String name, double price, int inv) {
        Product p = new Product(name, "d", price, "c", null, null, null, null, true, inv);
        ReflectionTestUtils.setField(p, "id", id);
        return p;
    }
}

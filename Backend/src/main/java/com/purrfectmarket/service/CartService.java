package com.purrfectmarket.service;

import com.purrfectmarket.dto.CartItemResponse;
import com.purrfectmarket.dto.CartResponse;
import com.purrfectmarket.model.CartItem;
import com.purrfectmarket.model.Order;
import com.purrfectmarket.model.OrderItem;
import com.purrfectmarket.model.Product;
import com.purrfectmarket.repository.CartItemRepository;
import com.purrfectmarket.repository.OrderRepository;
import com.purrfectmarket.repository.ProductRepository;
import com.purrfectmarket.util.ProductUrls;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public CartService(CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       OrderRepository orderRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    public CartResponse getCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserIdOrderByIdDesc(userId);
        List<CartItemResponse> itemResponses = new ArrayList<>();
        double subtotal = 0;
        int count = 0;
        for (CartItem ci : items) {
            Product p = ci.getProduct();
            double itemSubtotal = p.getPrice() * ci.getQuantity();
            subtotal += itemSubtotal;
            count += ci.getQuantity();
            itemResponses.add(new CartItemResponse(
                    p.getId(),
                    p.getName(),
                    ProductUrls.publicImageUrl(p),
                    p.getPrice(),
                    ci.getQuantity(),
                    itemSubtotal
            ));
        }
        return new CartResponse(itemResponses, subtotal, count);
    }

    @Transactional
    public CartItemResponse addItem(Long userId, Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));
        int qty = quantity != null && quantity > 0 ? quantity : 1;

        CartItem existing = cartItemRepository.findByUserIdAndProduct_Id(userId, productId).orElse(null);
        int newTotalQty = qty + (existing != null ? existing.getQuantity() : 0);
        assertStock(product, newTotalQty);

        if (existing != null) {
            existing.setQuantity(newTotalQty);
            cartItemRepository.save(existing);
            return toCartItemResponse(existing);
        }

        CartItem item = new CartItem(userId, product, qty);
        cartItemRepository.save(item);
        return toCartItemResponse(item);
    }

    @Transactional
    public CartItemResponse updateQuantity(Long userId, Long productId, Integer quantity) {
        CartItem item = cartItemRepository.findByUserIdAndProduct_Id(userId, productId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
        if (quantity != null && quantity > 0) {
            assertStock(item.getProduct(), quantity);
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        } else {
            cartItemRepository.delete(item);
            return null;
        }
        return toCartItemResponse(item);
    }

    private void assertStock(Product product, int requestedQty) {
        int inv = product.getInventoryQuantity() != null ? product.getInventoryQuantity() : 0;
        if (requestedQty > inv) {
            throw new IllegalStateException(
                    "Only " + inv + " in stock for \"" + product.getName() + "\"");
        }
    }

    @Transactional
    public void removeItem(Long userId, Long productId) {
        cartItemRepository.deleteByUserIdAndProduct_Id(userId, productId);
    }

    @Transactional
    public Order checkout(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserIdOrderByIdDesc(userId);
        if (items.isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        for (CartItem ci : items) {
            Product p = productRepository.findById(ci.getProduct().getId()).orElseThrow();
            int inv = p.getInventoryQuantity() != null ? p.getInventoryQuantity() : 0;
            if (inv < ci.getQuantity()) {
                throw new IllegalStateException("Not enough stock for: " + p.getName());
            }
        }

        double total = 0;
        for (CartItem ci : items) {
            total += ci.getProduct().getPrice() * ci.getQuantity();
        }

        Order order = new Order(userId, total);
        for (CartItem ci : items) {
            Product p = ci.getProduct();
            OrderItem oi = new OrderItem(p, ci.getQuantity(), p.getPrice());
            order.addItem(oi);
        }
        order = orderRepository.save(order);
        cartItemRepository.deleteByUserId(userId);

        for (CartItem ci : items) {
            Product p = productRepository.findById(ci.getProduct().getId()).orElseThrow();
            int newInv = (p.getInventoryQuantity() != null ? p.getInventoryQuantity() : 0) - ci.getQuantity();
            p.setInventoryQuantity(Math.max(0, newInv));
            p.setInStock(newInv > 0);
            productRepository.save(p);
        }

        return order;
    }

    private CartItemResponse toCartItemResponse(CartItem ci) {
        Product p = ci.getProduct();
        return new CartItemResponse(
                p.getId(),
                p.getName(),
                ProductUrls.publicImageUrl(p),
                p.getPrice(),
                ci.getQuantity(),
                p.getPrice() * ci.getQuantity()
        );
    }
}

package com.purrfectmarket.repository;

import com.purrfectmarket.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Order> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COUNT(o) > 0 FROM Order o JOIN o.items i WHERE o.userId = :userId AND i.product.id = :productId")
    boolean existsByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o")
    double sumTotalRevenue();

    @Query("SELECT i.product.name, SUM(i.quantity) FROM OrderItem i GROUP BY i.product.id, i.product.name ORDER BY SUM(i.quantity) DESC")
    List<Object[]> findTopProductsSorted();
}

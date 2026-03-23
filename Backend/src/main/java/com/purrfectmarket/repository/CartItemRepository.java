package com.purrfectmarket.repository;

import com.purrfectmarket.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserIdOrderByIdDesc(Long userId);

    Optional<CartItem> findByUserIdAndProduct_Id(Long userId, Long productId);

    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.userId = :userId AND c.product.id = :productId")
    void deleteByUserIdAndProduct_Id(Long userId, Long productId);

    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.userId = :userId")
    void deleteByUserId(Long userId);
}

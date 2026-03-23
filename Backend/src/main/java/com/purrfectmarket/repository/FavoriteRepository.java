package com.purrfectmarket.repository;

import com.purrfectmarket.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserIdOrderByIdDesc(Long userId);

    Optional<Favorite> findByUserIdAndProduct_Id(Long userId, Long productId);

    boolean existsByUserIdAndProduct_Id(Long userId, Long productId);

    @Modifying
    @Query("DELETE FROM Favorite f WHERE f.userId = :userId AND f.product.id = :productId")
    void deleteByUserIdAndProduct_Id(Long userId, Long productId);
}

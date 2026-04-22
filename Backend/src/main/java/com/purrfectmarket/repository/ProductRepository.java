package com.purrfectmarket.repository;

import com.purrfectmarket.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByOrderByNameAsc();

    @Query("SELECT DISTINCT p.category FROM Product p ORDER BY p.category")
    List<String> findDistinctCategories();

    List<Product> findByCategoryOrderByNameAsc(String category);

    List<Product> findByNameContainingIgnoreCaseOrderByNameAsc(String name);

    List<Product> findByCategoryAndNameContainingIgnoreCaseOrderByNameAsc(String category, String name);
}

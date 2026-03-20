package com.purrfectmarket.repository;

import com.purrfectmarket.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByOrderByNameAsc();

    List<Product> findByCategoryOrderByNameAsc(String category);

    List<Product> findByNameContainingIgnoreCaseOrderByNameAsc(String name);

    List<Product> findByCategoryAndNameContainingIgnoreCaseOrderByNameAsc(String category, String name);
}

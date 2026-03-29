package com.purrfectmarket.service;

import com.purrfectmarket.dto.AdminProductResponse;
import com.purrfectmarket.dto.UpdateInventoryRequest;
import com.purrfectmarket.model.Product;
import com.purrfectmarket.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminProductServiceTest {

    @Mock
    private ProductRepository productRepository;
    @Mock
    private ProductService productService;

    @InjectMocks
    private AdminProductService adminProductService;

    @Test
    void listAll_delegatesToRepositoryAndMapper() {
        Product p = new Product("N", "d", 1.0, "c", null, null, null, null, true, 1);
        when(productRepository.findAllByOrderByNameAsc()).thenReturn(List.of(p));
        when(productService.toAdminResponse(p)).thenReturn(
                new AdminProductResponse(1L, "N", "d", 1.0, "c", null, false, null, null, null, true, 1));

        var rows = adminProductService.listAll();

        assertThat(rows).hasSize(1);
        verify(productService).toAdminResponse(p);
    }

    @Test
    void updateInventory_validatesQuantity() {
        assertThatThrownBy(() -> adminProductService.updateInventory(1L, new UpdateInventoryRequest(-1)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("inventoryQuantity");
    }

    @Test
    void updateInventory_notFound() {
        when(productRepository.findById(9L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> adminProductService.updateInventory(9L, new UpdateInventoryRequest(5)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Product not found");
    }

    @Test
    void updateInventory_updatesStockFlags() {
        Product p = new Product("N", "d", 1.0, "c", null, null, null, null, true, 10);
        ReflectionTestUtils.setField(p, "id", 3L);
        when(productRepository.findById(3L)).thenReturn(Optional.of(p));
        when(productRepository.save(p)).thenReturn(p);
        when(productService.toAdminResponse(p)).thenReturn(
                new AdminProductResponse(3L, "N", "d", 1.0, "c", null, false, null, null, null, true, 0));

        adminProductService.updateInventory(3L, new UpdateInventoryRequest(0));

        assertThat(p.getInventoryQuantity()).isZero();
        assertThat(p.getInStock()).isFalse();
    }

    @Test
    void createProduct_requiresNameAndCategory() {
        assertThatThrownBy(() -> adminProductService.createProduct(
                " ", "d", 1.0, "c", 1, null, null, null, null, true, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Name");

        assertThatThrownBy(() -> adminProductService.createProduct(
                "N", "d", 1.0, " ", 1, null, null, null, null, true, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Category");
    }

    @Test
    void createProduct_withImageBytes() throws Exception {
        MockMultipartFile file = new MockMultipartFile("img", "a.png", "image/png", new byte[]{1, 2, 3});
        Product saved = new Product("N", "", 9.0, "Cat", null, null, null, null, true, 2);
        ReflectionTestUtils.setField(saved, "id", 44L);
        when(productRepository.save(any(Product.class))).thenReturn(saved);
        when(productService.toAdminResponse(saved)).thenReturn(
                new AdminProductResponse(44L, "N", "", 9.0, "Cat", null, true, null, null, null, true, 2));

        var res = adminProductService.createProduct(
                "N", "", 9.0, "Cat", 2, null, null, null, null, true, file);

        assertThat(res.id()).isEqualTo(44L);
        verify(productRepository).save(any(Product.class));
    }
}

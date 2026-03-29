package com.purrfectmarket.service;

import com.purrfectmarket.dto.ProductRequest;
import com.purrfectmarket.model.Product;
import com.purrfectmarket.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void createProduct_defaultsInventoryTo100WhenNull() {
        ProductRequest req = new ProductRequest(
                "N", "D", 9.99, "Cat", "http://img", 4.5, 10, "New", true, null);
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> {
            Product p = inv.getArgument(0);
            ReflectionTestUtils.setField(p, "id", 1L);
            return p;
        });

        var res = productService.createProduct(req);

        assertThat(res.name()).isEqualTo("N");
        ArgumentCaptor<Product> cap = ArgumentCaptor.forClass(Product.class);
        verify(productRepository).save(cap.capture());
        assertThat(cap.getValue().getInventoryQuantity()).isEqualTo(100);
    }

    @Test
    void toResponse_usesPublicImageUrl() {
        Product p = new Product("N", "D", 1.0, "c", "https://x/img.png", null, null, null, true, 1);
        ReflectionTestUtils.setField(p, "id", 5L);

        var res = productService.toResponse(p);

        assertThat(res.imageUrl()).isEqualTo("https://x/img.png");
        assertThat(res.id()).isEqualTo(5L);
    }

    @Test
    void toAdminResponse_detectsBlobImage() {
        Product p = new Product("N", "D", 1.0, "c", null, null, null, null, true, 3);
        ReflectionTestUtils.setField(p, "id", 7L);
        p.setImageData(new byte[]{1, 2});

        var res = productService.toAdminResponse(p);

        assertThat(res.hasStoredImage()).isTrue();
        assertThat(res.inventoryQuantity()).isEqualTo(3);
    }
}

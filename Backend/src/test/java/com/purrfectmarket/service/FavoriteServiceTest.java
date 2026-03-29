package com.purrfectmarket.service;

import com.purrfectmarket.model.Favorite;
import com.purrfectmarket.model.Product;
import com.purrfectmarket.repository.FavoriteRepository;
import com.purrfectmarket.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {

    @Mock
    private FavoriteRepository favoriteRepository;
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private FavoriteService favoriteService;

    @Test
    void addFavorite_productNotFound() {
        when(productRepository.findById(9L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> favoriteService.addFavorite(1L, 9L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Product not found");
    }

    @Test
    void addFavorite_idempotentWhenAlreadyFavorited() {
        Product p = product(3L, "Toy");
        when(productRepository.findById(3L)).thenReturn(Optional.of(p));
        when(favoriteRepository.existsByUserIdAndProduct_Id(1L, 3L)).thenReturn(true);

        var res = favoriteService.addFavorite(1L, 3L);

        assertThat(res.id()).isEqualTo(3L);
        verify(favoriteRepository, never()).save(any());
    }

    @Test
    void addFavorite_savesNew() {
        Product p = product(3L, "Toy");
        when(productRepository.findById(3L)).thenReturn(Optional.of(p));
        when(favoriteRepository.existsByUserIdAndProduct_Id(1L, 3L)).thenReturn(false);
        when(favoriteRepository.save(any(Favorite.class))).thenAnswer(inv -> inv.getArgument(0));

        favoriteService.addFavorite(1L, 3L);

        verify(favoriteRepository).save(any(Favorite.class));
    }

    @Test
    void getFavoriteProductIds_collectsIds() {
        Product p = product(7L, "X");
        Favorite f = new Favorite(2L, p);
        when(favoriteRepository.findByUserIdOrderByIdDesc(2L)).thenReturn(List.of(f));

        Set<Long> ids = favoriteService.getFavoriteProductIds(2L);

        assertThat(ids).containsExactly(7L);
    }

    @Test
    void isFavorite_delegates() {
        when(favoriteRepository.existsByUserIdAndProduct_Id(1L, 2L)).thenReturn(true);

        assertThat(favoriteService.isFavorite(1L, 2L)).isTrue();
    }

    private static Product product(long id, String name) {
        Product p = new Product(name, "", 1.0, "c", "/img", null, null, null, true, 1);
        ReflectionTestUtils.setField(p, "id", id);
        return p;
    }
}

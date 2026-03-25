package com.purrfectmarket.util;

import com.purrfectmarket.model.Product;

public final class ProductUrls {

    private ProductUrls() {
    }

    public static String publicImageUrl(Product p) {
        if (p.getImageData() != null && p.getImageData().length > 0) {
            return "/api/products/" + p.getId() + "/image";
        }
        return p.getImageUrl();
    }
}

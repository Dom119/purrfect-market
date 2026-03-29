package com.purrfectmarket.dto;

import java.io.Serializable;

public record AuthResponse(Long id, String email, String name, String userGroup) implements Serializable {
    private static final long serialVersionUID = 1L;
}

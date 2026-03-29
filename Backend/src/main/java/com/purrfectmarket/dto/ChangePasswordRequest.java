package com.purrfectmarket.dto;

public record ChangePasswordRequest(String currentPassword, String newPassword) {
}

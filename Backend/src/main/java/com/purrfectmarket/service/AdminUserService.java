package com.purrfectmarket.service;

import com.purrfectmarket.dto.AdminUserResponse;
import com.purrfectmarket.dto.UpdateUserGroupRequest;
import com.purrfectmarket.model.User;
import com.purrfectmarket.model.UserGroup;
import com.purrfectmarket.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminUserService {

    private final UserRepository userRepository;

    public AdminUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminUserResponse> listUsers() {
        return userRepository.findAll().stream()
                .sorted((a, b) -> a.getEmail().compareToIgnoreCase(b.getEmail()))
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AdminUserResponse updateUserGroup(Long userId, UpdateUserGroupRequest request) {
        if (request.userGroup() == null || request.userGroup().isBlank()) {
            throw new IllegalArgumentException("userGroup is required");
        }
        UserGroup newGroup;
        try {
            newGroup = UserGroup.valueOf(request.userGroup().trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("userGroup must be USER or MAIN_ADMIN");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getUserGroup() == UserGroup.MAIN_ADMIN && newGroup == UserGroup.USER) {
            long mainAdmins = userRepository.countByUserGroup(UserGroup.MAIN_ADMIN);
            if (mainAdmins <= 1) {
                throw new IllegalArgumentException("At least one Main Admin must remain");
            }
        }

        user.setUserGroup(newGroup);
        user = userRepository.save(user);
        return toResponse(user);
    }

    private AdminUserResponse toResponse(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getUserGroup().name()
        );
    }
}

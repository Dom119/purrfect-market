package com.purrfectmarket.controller;

import com.purrfectmarket.dto.AdminUserResponse;
import com.purrfectmarket.dto.UpdateUserGroupRequest;
import com.purrfectmarket.service.AdminUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> listUsers() {
        return ResponseEntity.ok(adminUserService.listUsers());
    }

    @PatchMapping("/{id}/group")
    public ResponseEntity<AdminUserResponse> updateGroup(
            @PathVariable Long id,
            @RequestBody UpdateUserGroupRequest body) {
        return ResponseEntity.ok(adminUserService.updateUserGroup(id, body));
    }
}

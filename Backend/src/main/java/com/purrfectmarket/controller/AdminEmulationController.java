package com.purrfectmarket.controller;

import com.purrfectmarket.dto.AuthResponse;
import com.purrfectmarket.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/emulate")
public class AdminEmulationController {

    private final AuthService authService;

    public AdminEmulationController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<AuthResponse> startEmulation(
            @PathVariable Long userId,
            HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null) return ResponseEntity.status(401).build();

        AuthResponse current = (AuthResponse) session.getAttribute("user");
        if (current == null) return ResponseEntity.status(401).build();

        // Prevent nested emulation
        if (session.getAttribute("originalAdmin") != null) {
            return ResponseEntity.badRequest().build();
        }

        AuthResponse target = authService.refreshAuthResponse(userId);
        session.setAttribute("originalAdmin", current);
        session.setAttribute("user", target);
        return ResponseEntity.ok(target);
    }
}

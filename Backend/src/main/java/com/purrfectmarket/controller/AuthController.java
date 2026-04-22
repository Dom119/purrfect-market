package com.purrfectmarket.controller;

import com.purrfectmarket.dto.AuthResponse;
import com.purrfectmarket.dto.ChangePasswordRequest;
import com.purrfectmarket.dto.EmulationStatus;
import com.purrfectmarket.dto.LoginRequest;
import com.purrfectmarket.dto.RegisterRequest;
import com.purrfectmarket.dto.UpdateProfileRequest;
import com.purrfectmarket.repository.UserRepository;
import com.purrfectmarket.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        AuthResponse response = authService.login(request);
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("user", response);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        AuthResponse response = authService.register(request);
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("user", response);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest httpRequest) {
        authService.logout();
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            return ResponseEntity.status(401).build();
        }
        AuthResponse cached = (AuthResponse) session.getAttribute("user");
        if (userRepository.findById(cached.id()).isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        AuthResponse fresh = authService.refreshAuthResponse(cached.id());
        session.setAttribute("user", fresh);
        return ResponseEntity.ok(fresh);
    }

    @PatchMapping("/profile")
    public ResponseEntity<AuthResponse> updateProfile(
            @RequestBody UpdateProfileRequest body,
            HttpServletRequest httpRequest) {
        Long userId = requireUserId(httpRequest);
        AuthResponse updated = authService.updateProfile(userId, body);
        httpRequest.getSession().setAttribute("user", updated);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/change-password")
    public ResponseEntity<AuthResponse> changePassword(
            @RequestBody ChangePasswordRequest body,
            HttpServletRequest httpRequest) {
        Long userId = requireUserId(httpRequest);
        AuthResponse updated = authService.changePassword(userId, body);
        httpRequest.getSession().setAttribute("user", updated);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/emulation")
    public ResponseEntity<EmulationStatus> emulationStatus(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null) return ResponseEntity.ok(new EmulationStatus(false, null));
        AuthResponse original = (AuthResponse) session.getAttribute("originalAdmin");
        return ResponseEntity.ok(original != null
                ? new EmulationStatus(true, original)
                : new EmulationStatus(false, null));
    }

    @PostMapping("/emulate/stop")
    public ResponseEntity<AuthResponse> stopEmulation(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null) return ResponseEntity.status(401).build();
        AuthResponse original = (AuthResponse) session.getAttribute("originalAdmin");
        if (original == null) return ResponseEntity.badRequest().build();
        AuthResponse fresh = authService.refreshAuthResponse(original.id());
        session.setAttribute("user", fresh);
        session.removeAttribute("originalAdmin");
        return ResponseEntity.ok(fresh);
    }

    private Long requireUserId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            throw new IllegalStateException("You must be signed in");
        }
        AuthResponse cached = (AuthResponse) session.getAttribute("user");
        if (cached.id() == null || userRepository.findById(cached.id()).isEmpty()) {
            throw new IllegalStateException("You must be signed in");
        }
        return cached.id();
    }
}

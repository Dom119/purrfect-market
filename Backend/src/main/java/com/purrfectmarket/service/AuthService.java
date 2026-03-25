package com.purrfectmarket.service;

import com.purrfectmarket.dto.AuthResponse;
import com.purrfectmarket.dto.LoginRequest;
import com.purrfectmarket.dto.RegisterRequest;
import com.purrfectmarket.model.User;
import com.purrfectmarket.model.UserGroup;
import com.purrfectmarket.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse login(LoginRequest request) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        User user = userRepository.findByEmailIgnoreCase(request.email()).orElseThrow();
        return toResponse(user);
    }

    public AuthResponse register(RegisterRequest request) {
        String emailLower = request.email().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(emailLower)) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = new User(
                emailLower,
                passwordEncoder.encode(request.password()),
                request.name()
        );
        user = userRepository.save(user);

        // Auto-login after registration
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        return toResponse(user);
    }

    public AuthResponse toResponse(User user) {
        UserGroup g = user.getUserGroup() != null ? user.getUserGroup() : UserGroup.USER;
        return new AuthResponse(user.getId(), user.getEmail(), user.getName(), g.name());
    }

    public AuthResponse refreshAuthResponse(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toResponse(user);
    }

    public void logout() {
        SecurityContextHolder.clearContext();
    }
}

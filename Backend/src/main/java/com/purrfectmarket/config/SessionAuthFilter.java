package com.purrfectmarket.config;

import com.purrfectmarket.dto.AuthResponse;
import com.purrfectmarket.model.UserGroup;
import com.purrfectmarket.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Restores Spring Security authentication from the session's "user" attribute.
 * Roles are loaded from the database on every request so they stay in sync with promotions
 * and avoid 403 on /api/admin/** when /auth/me has not yet refreshed the session (parallel requests).
 */
public class SessionAuthFilter extends OncePerRequestFilter {

    private static final String SESSION_USER_ATTR = "user";
    private final UserRepository userRepository;

    public SessionAuthFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * After some session stores / deserialization paths, the attribute may not be {@link AuthResponse}
     * (e.g. Map), so we resolve the user id defensively and always load roles from the database.
     */
    private static Long extractUserId(Object userAttr) {
        if (userAttr instanceof AuthResponse cached && cached.id() != null) {
            return cached.id();
        }
        if (userAttr instanceof Map<?, ?> map) {
            Object id = map.get("id");
            if (id instanceof Number n) {
                return n.longValue();
            }
        }
        return null;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session != null) {
            Object userAttr = session.getAttribute(SESSION_USER_ATTR);
            Long userId = extractUserId(userAttr);
            if (userId != null) {
                userRepository.findById(userId).ifPresent(user -> {
                    List<GrantedAuthority> authorities = new ArrayList<>();
                    authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                    if (user.getUserGroup() == UserGroup.MAIN_ADMIN) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_MAIN_ADMIN"));
                    }
                    var auth = new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            null,
                            authorities
                    );
                    SecurityContextHolder.getContext().setAuthentication(auth);
                });
            }
        }
        filterChain.doFilter(request, response);
    }
}

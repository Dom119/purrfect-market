package com.purrfectmarket.config;

import com.purrfectmarket.dto.AuthResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Restores Spring Security authentication from the session's "user" attribute.
 * This bridges the custom session-based auth (set by AuthController during login/register)
 * with Spring Security's authorization checks, fixing 403 on /api/favorites when the
 * SecurityContext was not persisted or restored correctly across requests.
 */
public class SessionAuthFilter extends OncePerRequestFilter {

    private static final String SESSION_USER_ATTR = "user";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session != null) {
            Object userAttr = session.getAttribute(SESSION_USER_ATTR);
            if (userAttr instanceof AuthResponse user && user.id() != null) {
                var auth = new UsernamePasswordAuthenticationToken(
                        user.email(),
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_USER"))
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        filterChain.doFilter(request, response);
    }
}

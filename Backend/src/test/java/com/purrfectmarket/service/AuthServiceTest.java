package com.purrfectmarket.service;

import com.purrfectmarket.dto.ChangePasswordRequest;
import com.purrfectmarket.dto.LoginRequest;
import com.purrfectmarket.dto.RegisterRequest;
import com.purrfectmarket.dto.UpdateProfileRequest;
import com.purrfectmarket.model.User;
import com.purrfectmarket.model.UserGroup;
import com.purrfectmarket.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void login_setsSecurityContext_andReturnsAuthResponse() {
        User user = userWithId(1L, "a@b.com", "hash", "Alice");
        user.setUserGroup(UserGroup.USER);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenAnswer(inv -> mock(Authentication.class));
        when(userRepository.findByEmailIgnoreCase("a@b.com")).thenReturn(Optional.of(user));

        var res = authService.login(new LoginRequest("a@b.com", "secret"));

        assertThat(res.email()).isEqualTo("a@b.com");
        assertThat(res.name()).isEqualTo("Alice");
        assertThat(res.userGroup()).isEqualTo("USER");
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
    }

    @Test
    void register_throwsWhenEmailExists() {
        when(userRepository.existsByEmailIgnoreCase("x@y.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(new RegisterRequest("N", "x@y.com", "password1")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already registered");
    }

    @Test
    void register_savesUser_andAuthenticates() {
        when(userRepository.existsByEmailIgnoreCase("new@y.com")).thenReturn(false);
        when(passwordEncoder.encode("password1")).thenReturn("ENC");
        User saved = userWithId(2L, "new@y.com", "ENC", "New");
        when(userRepository.save(any(User.class))).thenReturn(saved);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenAnswer(inv -> mock(Authentication.class));

        var res = authService.register(new RegisterRequest("New", "new@y.com", "password1"));

        assertThat(res.email()).isEqualTo("new@y.com");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void refreshAuthResponse_throwsWhenUserMissing() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.refreshAuthResponse(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("not found");
    }

    @Test
    void logout_clearsContext() {
        SecurityContextHolder.getContext().setAuthentication(mock(Authentication.class));
        authService.logout();
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    @Test
    void updateProfile_throwsWhenNameBlank() {
        assertThatThrownBy(() -> authService.updateProfile(1L, new UpdateProfileRequest("  ")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Name is required");
    }

    @Test
    void updateProfile_updatesName() {
        User user = userWithId(1L, "u@u.com", "h", "Old");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        var res = authService.updateProfile(1L, new UpdateProfileRequest("  Trimmed  "));

        assertThat(res.name()).isEqualTo("Trimmed");
        verify(userRepository).save(user);
    }

    @Test
    void changePassword_validatesLengthAndCurrent() {
        assertThatThrownBy(() -> authService.changePassword(1L, new ChangePasswordRequest("x", "short")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("8 characters");

        assertThatThrownBy(() -> authService.changePassword(1L, new ChangePasswordRequest("", "longenough")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Current password");
    }

    @Test
    void changePassword_rejectsWrongCurrentPassword() {
        User user = userWithId(1L, "u@u.com", "stored-hash", "N");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(eq("wrong"), eq("stored-hash"))).thenReturn(false);

        assertThatThrownBy(() -> authService.changePassword(1L, new ChangePasswordRequest("wrong", "newpass12")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("incorrect");
    }

    @Test
    void changePassword_success() {
        User user = userWithId(1L, "u@u.com", "stored-hash", "N");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(eq("cur"), eq("stored-hash"))).thenReturn(true);
        when(passwordEncoder.encode("newpass12")).thenReturn("new-hash");
        when(userRepository.save(user)).thenReturn(user);

        var res = authService.changePassword(1L, new ChangePasswordRequest("cur", "newpass12"));

        assertThat(res.email()).isEqualTo("u@u.com");
        verify(passwordEncoder).encode("newpass12");
    }

    private static User userWithId(long id, String email, String hash, String name) {
        User u = new User(email, hash, name);
        org.springframework.test.util.ReflectionTestUtils.setField(u, "id", id);
        return u;
    }
}

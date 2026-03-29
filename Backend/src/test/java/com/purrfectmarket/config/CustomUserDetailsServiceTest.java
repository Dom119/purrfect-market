package com.purrfectmarket.config;

import com.purrfectmarket.model.User;
import com.purrfectmarket.model.UserGroup;
import com.purrfectmarket.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void loadUserByUsername_throwsWhenMissing() {
        when(userRepository.findByEmailIgnoreCase("nope@test.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> customUserDetailsService.loadUserByUsername("nope@test.com"))
                .isInstanceOf(UsernameNotFoundException.class);
    }

    @Test
    void loadUserByUsername_userGetsRoleUser() {
        User u = new User("a@b.com", "hash", "A");
        ReflectionTestUtils.setField(u, "id", 1L);
        when(userRepository.findByEmailIgnoreCase("a@b.com")).thenReturn(Optional.of(u));

        var details = customUserDetailsService.loadUserByUsername("a@b.com");

        assertThat(details.getUsername()).isEqualTo("a@b.com");
        assertThat(details.getPassword()).isEqualTo("hash");
        assertThat(details.getAuthorities()).extracting(a -> a.getAuthority())
                .containsExactly("ROLE_USER");
    }

    @Test
    void loadUserByUsername_mainAdminGetsBothRoles() {
        User u = new User("admin@test.com", "hash", "Admin");
        u.setUserGroup(UserGroup.MAIN_ADMIN);
        when(userRepository.findByEmailIgnoreCase("admin@test.com")).thenReturn(Optional.of(u));

        var details = customUserDetailsService.loadUserByUsername("admin@test.com");

        assertThat(details.getAuthorities()).extracting(a -> a.getAuthority())
                .containsExactlyInAnyOrder("ROLE_USER", "ROLE_MAIN_ADMIN");
    }
}

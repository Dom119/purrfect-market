package com.purrfectmarket.service;

import com.purrfectmarket.dto.UpdateUserGroupRequest;
import com.purrfectmarket.model.User;
import com.purrfectmarket.model.UserGroup;
import com.purrfectmarket.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminUserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AdminUserService adminUserService;

    @Test
    void listUsers_sortsByEmail() {
        User b = user(2L, "b@x.com", "B");
        User a = user(1L, "a@x.com", "A");
        when(userRepository.findAll()).thenReturn(List.of(b, a));

        var rows = adminUserService.listUsers();

        assertThat(rows).extracting(r -> r.email()).containsExactly("a@x.com", "b@x.com");
    }

    @Test
    void updateUserGroup_invalidBlank() {
        assertThatThrownBy(() -> adminUserService.updateUserGroup(1L, new UpdateUserGroupRequest("  ")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("required");
    }

    @Test
    void updateUserGroup_invalidEnum() {
        assertThatThrownBy(() -> adminUserService.updateUserGroup(1L, new UpdateUserGroupRequest("ADMIN")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("USER or MAIN_ADMIN");
    }

    @Test
    void updateUserGroup_blocksDemotingLastMainAdmin() {
        User admin = user(1L, "a@x.com", "A");
        admin.setUserGroup(UserGroup.MAIN_ADMIN);
        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(userRepository.countByUserGroup(UserGroup.MAIN_ADMIN)).thenReturn(1L);

        assertThatThrownBy(() -> adminUserService.updateUserGroup(1L, new UpdateUserGroupRequest("USER")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Main Admin");
    }

    @Test
    void updateUserGroup_success() {
        User u = user(2L, "u@x.com", "U");
        u.setUserGroup(UserGroup.USER);
        when(userRepository.findById(2L)).thenReturn(Optional.of(u));
        when(userRepository.save(u)).thenReturn(u);

        var res = adminUserService.updateUserGroup(2L, new UpdateUserGroupRequest("main_admin"));

        assertThat(res.userGroup()).isEqualTo("MAIN_ADMIN");
        verify(userRepository).save(u);
    }

    private static User user(long id, String email, String name) {
        User u = new User(email, "h", name);
        ReflectionTestUtils.setField(u, "id", id);
        return u;
    }
}

package com.purrfectmarket.config;

import com.purrfectmarket.model.User;
import com.purrfectmarket.model.UserGroup;
import com.purrfectmarket.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User entity = userRepository.findByEmailIgnoreCase(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        if (entity.getUserGroup() == UserGroup.MAIN_ADMIN) {
            authorities.add(new SimpleGrantedAuthority("ROLE_MAIN_ADMIN"));
        }
        return org.springframework.security.core.userdetails.User.builder()
                .username(entity.getEmail())
                .password(entity.getPasswordHash())
                .authorities(authorities)
                .build();
    }
}

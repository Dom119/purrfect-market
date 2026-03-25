package com.purrfectmarket.config;

import com.purrfectmarket.model.User;
import com.purrfectmarket.model.UserGroup;
import com.purrfectmarket.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmailIgnoreCase("test@purrfect.com").isEmpty()) {
            User testUser = new User(
                    "test@purrfect.com",
                    passwordEncoder.encode("password"),
                    "Test User"
            );
            userRepository.save(testUser);
        }

        String mainAdminEmail = "quydung119@gmail.com";
        if (userRepository.findByEmailIgnoreCase(mainAdminEmail).isEmpty()) {
            User mainAdmin = new User(
                    mainAdminEmail,
                    passwordEncoder.encode("PurrfectAdmin!2025"),
                    "Main Admin"
            );
            mainAdmin.setUserGroup(UserGroup.MAIN_ADMIN);
            userRepository.save(mainAdmin);
        } else {
            userRepository.findByEmailIgnoreCase(mainAdminEmail).ifPresent(u -> {
                if (u.getUserGroup() != UserGroup.MAIN_ADMIN) {
                    u.setUserGroup(UserGroup.MAIN_ADMIN);
                    userRepository.save(u);
                }
            });
        }
    }
}

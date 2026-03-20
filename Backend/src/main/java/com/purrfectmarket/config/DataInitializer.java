package com.purrfectmarket.config;

import com.purrfectmarket.model.User;
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
    }
}

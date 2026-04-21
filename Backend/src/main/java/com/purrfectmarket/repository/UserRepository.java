package com.purrfectmarket.repository;

import com.purrfectmarket.model.User;
import com.purrfectmarket.model.UserGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    long countByUserGroup(UserGroup userGroup);

    long countByCreatedAtAfter(Instant since);

}

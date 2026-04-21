package com.purrfectmarket.model;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "users", indexes = @Index(unique = true, columnList = "email"))
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, name = "password_hash")
    private String passwordHash;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_group")
    private UserGroup userGroup = UserGroup.USER;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    protected User() {
    }

    public User(String email, String passwordHash, String name) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.name = name;
        this.userGroup = UserGroup.USER;
    }

    public UserGroup getUserGroup() {
        return userGroup != null ? userGroup : UserGroup.USER;
    }

    public void setUserGroup(UserGroup userGroup) {
        this.userGroup = userGroup != null ? userGroup : UserGroup.USER;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}

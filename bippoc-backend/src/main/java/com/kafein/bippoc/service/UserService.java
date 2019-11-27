package com.kafein.bippoc.service;

import com.kafein.bippoc.model.User;
import com.kafein.bippoc.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private EmailService emailService;

    @Value("${server.url}")
    private String serverUrl;

    public void registerUser(User user) {
        log.debug("Registering legacy user with username: {}", user.getUsername());
        user.setLegacy(true);
        registerUserV2(user);
    }

    public void registerUserV2(User user) {
        log.debug("Registering user with username: {}", user.getUsername());
        user.setVerified(false);
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        userRepo.save(user);
        sendVerificationEmail(user);
    }

    public boolean verifyToken(String token) {
        log.debug("Verifying token: {}", token);
        User user = userRepo.findByToken(token);
        if (user != null) {
            user.setVerified(true);
            userRepo.save(user);
            return true;
        } else {
            return false;
        }
    }

    private void sendVerificationEmail(User user) {
        String token = UUID.randomUUID().toString();
        user.setToken(token);
        userRepo.save(user);

        log.debug("Sending verification email to: {} token: {}", user.getUsername(), token);
        emailService.sentVerificationEmail(user.getUsername(), "BİP PoC User Verification", serverUrl + token);
    }

    public void updateLastSeen(String username) {
        User user = userRepo.findByUsername(username);
        user.setLastSeen(LocalDateTime.now());
        userRepo.save(user);
    }
}

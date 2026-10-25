package com.intervai.service;

import com.intervai.dto.AuthResponse;
import com.intervai.dto.LoginRequest;
import com.intervai.dto.RegisterRequest;
import com.intervai.dto.UserResponse;
import com.intervai.entity.Role;
import com.intervai.entity.User;
import com.intervai.repository.UserRepository;
import com.intervai.security.JwtUtil;
import com.intervai.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final com.intervai.security.AccountLockoutService accountLockoutService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        // Auto login after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateJwtToken(authentication);

        return AuthResponse.builder()
                .token(jwt)
                .user(UserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail();
        if (accountLockoutService.isLocked(email)) {
            throw new IllegalArgumentException("Account is temporarily locked due to excessive failed login attempts. Please try again in 15 minutes.");
        }

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (Exception ex) {
            accountLockoutService.recordFailedAttempt(email);
            throw ex;
        }

        // Reset failed attempt counter on successful login
        accountLockoutService.resetAttempts(email);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return AuthResponse.builder()
                .token(jwt)
                .user(UserResponse.builder()
                        .id(userDetails.getId())
                        .name(userDetails.getName())
                        .email(userDetails.getEmail())
                        .role(userDetails.getUser().getRole())
                        .build())
                .build();
    }
}

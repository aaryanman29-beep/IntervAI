package com.intervai.controller;

import com.intervai.dto.ApiResponse;
import com.intervai.dto.AuthResponse;
import com.intervai.dto.LoginRequest;
import com.intervai.dto.RegisterRequest;
import com.intervai.dto.UserResponse;
import com.intervai.security.UserDetailsImpl;
import com.intervai.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            jakarta.servlet.http.HttpServletResponse httpResponse) {
        AuthResponse response = authService.register(request);
        setAuthCookie(httpResponse, response.getToken());
        return ResponseEntity.ok(ApiResponse.success(response, "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            jakarta.servlet.http.HttpServletResponse httpResponse) {
        AuthResponse response = authService.login(request);
        setAuthCookie(httpResponse, response.getToken());
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(jakarta.servlet.http.HttpServletResponse httpResponse) {
        org.springframework.http.ResponseCookie cookie = org.springframework.http.ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(false) // Set to true behind HTTPS production proxy
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        httpResponse.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok(ApiResponse.success("success", "Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        UserResponse response = UserResponse.builder()
                .id(userDetails.getId())
                .name(userDetails.getName())
                .email(userDetails.getEmail())
                .role(userDetails.getUser().getRole())
                .targetRole(userDetails.getUser().getTargetRole())
                .experienceLevel(userDetails.getUser().getExperienceLevel())
                .build();
        return ResponseEntity.ok(ApiResponse.success(response, "User details fetched"));
    }

    private void setAuthCookie(jakarta.servlet.http.HttpServletResponse response, String token) {
        org.springframework.http.ResponseCookie cookie = org.springframework.http.ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(false) // Set to true in HTTPS environments
                .path("/")
                .maxAge(86400) // 24 hours matching token expiration
                .sameSite("Lax")
                .build();
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString());
    }
}

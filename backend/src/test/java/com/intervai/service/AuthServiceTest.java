package com.intervai.service;

import com.intervai.dto.RegisterRequest;
import com.intervai.entity.User;
import com.intervai.repository.UserRepository;
import com.intervai.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegister_ExistingEmail_ThrowsException() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@test.com");
        
        when(userRepository.existsByEmail(anyString())).thenReturn(true);
        
        assertThrows(IllegalArgumentException.class, () -> authService.register(request));
    }
}

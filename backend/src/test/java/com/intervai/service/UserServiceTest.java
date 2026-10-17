package com.intervai.service;

import com.intervai.dto.UpdateProfileRequest;
import com.intervai.dto.UserResponse;
import com.intervai.entity.Role;
import com.intervai.entity.User;
import com.intervai.exception.ResourceNotFoundException;
import com.intervai.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetProfile_Success() {
        User user = User.builder()
                .id("user-123")
                .name("Alex Smith")
                .email("alex@example.com")
                .role(Role.USER)
                .targetRole("Full Stack Developer")
                .experienceLevel("Mid-Level")
                .build();

        when(userRepository.findById("user-123")).thenReturn(Optional.of(user));

        UserResponse response = userService.getProfile("user-123");

        assertNotNull(response);
        assertEquals("Alex Smith", response.getName());
        assertEquals("alex@example.com", response.getEmail());
        assertEquals("Full Stack Developer", response.getTargetRole());
    }

    @Test
    void testGetProfile_UserNotFound() {
        when(userRepository.findById("non-existent")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getProfile("non-existent"));
    }

    @Test
    void testUpdateProfile_Success() {
        User user = User.builder()
                .id("user-123")
                .name("Alex Smith")
                .email("alex@example.com")
                .role(Role.USER)
                .targetRole("Frontend Dev")
                .experienceLevel("Junior")
                .build();

        when(userRepository.findById("user-123")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateProfileRequest request = UpdateProfileRequest.builder()
                .name("Alex Johnson")
                .targetRole("Senior Backend Engineer")
                .experienceLevel("Senior")
                .build();

        UserResponse response = userService.updateProfile("user-123", request);

        assertNotNull(response);
        assertEquals("Alex Johnson", response.getName());
        assertEquals("Senior Backend Engineer", response.getTargetRole());
        assertEquals("Senior", response.getExperienceLevel());
        verify(userRepository, times(1)).save(user);
    }
}

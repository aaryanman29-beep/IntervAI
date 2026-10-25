package com.intervai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.intervai.entity.LearningRoadmap;
import com.intervai.entity.Role;
import com.intervai.entity.User;
import com.intervai.repository.LearningRoadmapRepository;
import com.intervai.repository.UserRepository;
import com.intervai.service.ai.RoadmapGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class RoadmapServiceTest {

    @Mock
    private LearningRoadmapRepository roadmapRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoadmapGenerator roadmapGenerator;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private RoadmapService roadmapService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        sampleUser = User.builder()
                .id("user-100")
                .name("Taylor Swift")
                .email("taylor@example.com")
                .role(Role.USER)
                .build();
    }

    @Test
    void testGetUserRoadmap() {
        LearningRoadmap item = LearningRoadmap.builder()
                .id("rm-1")
                .topic("Distributed Systems")
                .priority("HIGH")
                .status("IN_PROGRESS")
                .build();

        when(roadmapRepository.findByUserId("user-100")).thenReturn(List.of(item));

        List<LearningRoadmap> result = roadmapService.getUserRoadmap("user-100");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Distributed Systems", result.get(0).getTopic());
    }

    @Test
    void testGenerateRoadmap_Success() {
        when(userRepository.findById("user-100")).thenReturn(Optional.of(sampleUser));
        when(roadmapRepository.findByUserId("user-100")).thenReturn(List.of());

        Map<String, Object> roadmapItem = Map.of(
                "topic", "Microservices Architecture",
                "priority", "HIGH",
                "description", "Learn service discovery and circuit breaker patterns",
                "recommendedResources", List.of("Resource 1")
        );

        when(roadmapGenerator.generateRoadmap(anyString(), anyString(), anyString()))
                .thenReturn(List.of(roadmapItem));

        when(roadmapRepository.save(any(LearningRoadmap.class))).thenAnswer(inv -> inv.getArgument(0));

        roadmapService.generateRoadmap("user-100", "Backend Lead", "Java, Docker", "Resilience");

        verify(roadmapRepository, times(1)).deleteAll(any());
        verify(roadmapRepository, times(1)).save(any(LearningRoadmap.class));
    }
}

package com.intervai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.intervai.dto.DashboardResponse;
import com.intervai.entity.Interview;
import com.intervai.entity.InterviewStatus;
import com.intervai.repository.InterviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DashboardServiceTest {

    @Mock
    private InterviewRepository interviewRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private DashboardService dashboardService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetDashboardData_EmptyInterviews() {
        when(interviewRepository.findByUserIdOrderByCreatedAtDesc("user-1")).thenReturn(Collections.emptyList());

        DashboardResponse response = dashboardService.getDashboardData("user-1");

        assertNotNull(response);
        assertEquals(0, response.getTotalInterviews());
        assertEquals(0, response.getOverallScore());
        assertTrue(response.getStrengths().isEmpty());
    }

    @Test
    void testGetDashboardData_WithCompletedInterviews() {
        Interview interview1 = Interview.builder()
                .status(InterviewStatus.COMPLETED)
                .overallScore(80)
                .technicalScore(85)
                .hrScore(75)
                .communicationScore(80)
                .strengths("[\"System Design\",\"Spring Boot\"]")
                .weakAreas("[\"SQL Optimization\"]")
                .build();

        Interview interview2 = Interview.builder()
                .status(InterviewStatus.COMPLETED)
                .overallScore(90)
                .technicalScore(95)
                .hrScore(85)
                .communicationScore(90)
                .build();

        when(interviewRepository.findByUserIdOrderByCreatedAtDesc("user-1")).thenReturn(List.of(interview1, interview2));

        DashboardResponse response = dashboardService.getDashboardData("user-1");

        assertNotNull(response);
        assertEquals(2, response.getTotalInterviews());
        assertEquals(85, response.getOverallScore()); // (80 + 90) / 2
        assertEquals(90, response.getTechnicalScore()); // (85 + 95) / 2
        assertEquals(80, response.getHrScore()); // (75 + 85) / 2
        assertEquals(85, response.getCommunicationScore()); // (80 + 90) / 2
    }
}

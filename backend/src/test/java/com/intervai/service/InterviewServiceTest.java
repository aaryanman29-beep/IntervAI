package com.intervai.service;

import com.intervai.dto.CreateInterviewRequest;
import com.intervai.entity.*;
import com.intervai.exception.ResourceNotFoundException;
import com.intervai.repository.*;
import com.intervai.service.ai.AnswerEvaluator;
import com.intervai.service.ai.QuestionGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class InterviewServiceTest {

    @Mock
    private InterviewRepository interviewRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private AnswerRepository answerRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ResumeRepository resumeRepository;

    @Mock
    private ResumeAnalysisRepository resumeAnalysisRepository;

    @Mock
    private QuestionGenerator questionGenerator;

    @Mock
    private AnswerEvaluator answerEvaluator;

    @InjectMocks
    private InterviewService interviewService;

    private User sampleUser;
    private Interview sampleInterview;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        sampleUser = User.builder()
                .id("user-123")
                .name("Alex Morgan")
                .email("alex@example.com")
                .role(Role.USER)
                .build();

        sampleInterview = Interview.builder()
                .id("interview-456")
                .user(sampleUser)
                .targetRole("Frontend Developer")
                .experienceLevel("MID")
                .interviewType(InterviewType.TECHNICAL)
                .company("Acme Corp")
                .status(InterviewStatus.CREATED)
                .build();
    }

    @Test
    void testCreateInterview_Success() {
        CreateInterviewRequest request = new CreateInterviewRequest();
        request.setTargetRole("Frontend Developer");
        request.setExperienceLevel("MID");
        request.setInterviewType(InterviewType.TECHNICAL);
        request.setCompany("Acme Corp");

        when(userRepository.findById("user-123")).thenReturn(Optional.of(sampleUser));
        when(interviewRepository.save(any(Interview.class))).thenAnswer(invocation -> {
            Interview i = invocation.getArgument(0);
            i.setId("interview-456");
            return i;
        });

        Map<String, Object> mockQ = Map.of(
                "questionText", "Explain the React Fiber reconciler architecture.",
                "questionType", "TECHNICAL",
                "difficulty", "MEDIUM",
                "topic", "React Internals"
        );
        when(questionGenerator.generateQuestions(anyString(), anyString(), anyString(), anyString(), anyString()))
                .thenReturn(List.of(mockQ));

        Interview created = interviewService.createInterview("user-123", request);

        assertNotNull(created);
        assertEquals("Frontend Developer", created.getTargetRole());
        assertEquals(InterviewStatus.CREATED, created.getStatus());
        verify(questionRepository, times(1)).save(any(Question.class));
    }

    @Test
    void testStartInterview_Success() {
        when(interviewRepository.findByIdAndUserId("interview-456", "user-123"))
                .thenReturn(Optional.of(sampleInterview));
        when(interviewRepository.save(any(Interview.class))).thenAnswer(inv -> inv.getArgument(0));

        Interview started = interviewService.startInterview("interview-456", "user-123");

        assertEquals(InterviewStatus.IN_PROGRESS, started.getStatus());
        verify(interviewRepository, times(1)).save(sampleInterview);
    }

    @Test
    void testStartInterview_AlreadyStarted_ThrowsException() {
        sampleInterview.setStatus(InterviewStatus.IN_PROGRESS);
        when(interviewRepository.findByIdAndUserId("interview-456", "user-123"))
                .thenReturn(Optional.of(sampleInterview));

        assertThrows(IllegalArgumentException.class, () ->
                interviewService.startInterview("interview-456", "user-123"));
    }

    @Test
    void testGetInterview_NotFound_ThrowsException() {
        when(interviewRepository.findByIdAndUserId("unknown-id", "user-123"))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                interviewService.getInterview("unknown-id", "user-123"));
    }
}

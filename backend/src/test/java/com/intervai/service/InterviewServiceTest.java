package com.intervai.service;

import com.intervai.dto.CreateInterviewRequest;
import com.intervai.dto.TranscribeResponse;
import com.intervai.entity.*;
import com.intervai.exception.ResourceNotFoundException;
import com.intervai.repository.*;
import com.intervai.service.ai.AnswerEvaluator;
import com.intervai.service.ai.ElevenLabsSttService;
import com.intervai.service.ai.QuestionGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;

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

    @Mock
    private ElevenLabsSttService elevenLabsSttService;

    @Mock
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

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

    @Test
    void testTranscribeAndProcessAnswer_SuccessWithQuestionAndEvaluation() {
        sampleInterview.setStatus(InterviewStatus.IN_PROGRESS);
        Question question = Question.builder()
                .id("q-1")
                .interview(sampleInterview)
                .questionText("Explain Java concurrency")
                .build();

        MockMultipartFile audio = new MockMultipartFile("audio", "speech.webm", "audio/webm", "bytes".getBytes());

        when(interviewRepository.findByIdAndUserId("interview-456", "user-123"))
                .thenReturn(Optional.of(sampleInterview));
        when(questionRepository.findById("q-1")).thenReturn(Optional.of(question));
        when(answerRepository.findByQuestionId("q-1")).thenReturn(Optional.empty());

        when(elevenLabsSttService.transcribeAudio(audio))
                .thenReturn(new ElevenLabsSttService.TranscriptionResult("Java concurrency uses threads and locks", "en"));

        when(answerEvaluator.evaluateAnswer(anyString(), anyString(), anyString(), anyString()))
                .thenReturn(Map.of(
                        "score", 90,
                        "correctnessScore", 92,
                        "clarityScore", 88,
                        "technicalDepthScore", 90,
                        "strengths", List.of("Good explanation"),
                        "weaknesses", List.of("None"),
                        "feedback", "Well done",
                        "needsFollowUp", false
                ));

        when(answerRepository.save(any(Answer.class))).thenAnswer(invocation -> {
            Answer a = invocation.getArgument(0);
            a.setId("ans-saved-1");
            return a;
        });

        TranscribeResponse response = interviewService.transcribeAndProcessAnswer("user-123", "interview-456", "q-1", audio);

        assertNotNull(response);
        assertEquals("Java concurrency uses threads and locks", response.getTranscript());
        assertEquals("ans-saved-1", response.getAnswerId());
        assertTrue(response.getEvaluated());
        assertEquals("en", response.getDetectedLanguage());
        verify(answerRepository, times(1)).save(any(Answer.class));
    }

    @Test
    void testTranscribeAndProcessAnswer_UnauthorizedSession() {
        MockMultipartFile audio = new MockMultipartFile("audio", "speech.webm", "audio/webm", "bytes".getBytes());
        when(interviewRepository.findByIdAndUserId("interview-456", "user-unauthorized"))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                interviewService.transcribeAndProcessAnswer("user-unauthorized", "interview-456", "q-1", audio));
    }

    @Test
    void testTranscribeAndProcessAnswer_EmptyTranscript_ThrowsException() {
        sampleInterview.setStatus(InterviewStatus.IN_PROGRESS);
        MockMultipartFile audio = new MockMultipartFile("audio", "speech.webm", "audio/webm", "bytes".getBytes());

        when(interviewRepository.findByIdAndUserId("interview-456", "user-123"))
                .thenReturn(Optional.of(sampleInterview));
        when(elevenLabsSttService.transcribeAudio(audio))
                .thenReturn(new ElevenLabsSttService.TranscriptionResult("", "en"));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                interviewService.transcribeAndProcessAnswer("user-123", "interview-456", null, audio));
        assertTrue(ex.getMessage().contains("No speech detected"));
    }
}

package com.intervai.service.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ElevenLabsSttServiceTest {

    @Mock
    private RestTemplate restTemplate;

    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private ElevenLabsSttService elevenLabsSttService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(elevenLabsSttService, "apiKey", "test-api-key");
        ReflectionTestUtils.setField(elevenLabsSttService, "modelId", "scribe_v2");
        ReflectionTestUtils.setField(elevenLabsSttService, "apiUrl", "https://api.elevenlabs.io/v1/speech-to-text");
        ReflectionTestUtils.setField(elevenLabsSttService, "objectMapper", objectMapper);
    }

    @Test
    void testTranscribeAudio_Success() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "answer.webm", "audio/webm", "test audio content".getBytes());

        String apiResponse = """
            {
              "text": "I have extensive experience building scalable Java Spring Boot microservices.",
              "language_code": "eng",
              "language_probability": 0.99
            }
            """;

        when(restTemplate.postForEntity(anyString(), any(), eq(String.class)))
                .thenReturn(new ResponseEntity<>(apiResponse, HttpStatus.OK));

        ElevenLabsSttService.TranscriptionResult result = elevenLabsSttService.transcribeAudio(file);

        assertNotNull(result);
        assertEquals("I have extensive experience building scalable Java Spring Boot microservices.", result.text());
        assertEquals("eng", result.languageCode());
        verify(restTemplate, times(1)).postForEntity(anyString(), any(), eq(String.class));
    }

    @Test
    void testTranscribeAudio_MissingApiKey_ProvidesFallback() {
        ReflectionTestUtils.setField(elevenLabsSttService, "apiKey", "");
        MockMultipartFile file = new MockMultipartFile(
                "file", "answer.webm", "audio/webm", "test audio content".getBytes());

        ElevenLabsSttService.TranscriptionResult result = elevenLabsSttService.transcribeAudio(file);
        assertNotNull(result);
        assertTrue(result.text().contains("local transcription preview"));
        assertEquals("en", result.languageCode());
    }

    @Test
    void testTranscribeAudio_EmptyFile() {
        MockMultipartFile emptyFile = new MockMultipartFile(
                "file", "empty.webm", "audio/webm", new byte[0]);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                elevenLabsSttService.transcribeAudio(emptyFile));
        assertTrue(ex.getMessage().contains("empty"));
    }

    @Test
    void testTranscribeAudio_OversizedFile() {
        byte[] largeBytes = new byte[26 * 1024 * 1024]; // 26MB exceeds 25MB limit
        MockMultipartFile oversizedFile = new MockMultipartFile(
                "file", "large.webm", "audio/webm", largeBytes);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                elevenLabsSttService.transcribeAudio(oversizedFile));
        assertTrue(ex.getMessage().contains("maximum allowed size"));
    }

    @Test
    void testTranscribeAudio_RateLimitExceeded() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "answer.webm", "audio/webm", "audio bytes".getBytes());

        when(restTemplate.postForEntity(anyString(), any(), eq(String.class)))
                .thenThrow(new HttpClientErrorException(HttpStatus.TOO_MANY_REQUESTS, "Too Many Requests"));

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                elevenLabsSttService.transcribeAudio(file));
        assertTrue(ex.getMessage().contains("rate limit exceeded"));
    }

    @Test
    void testTranscribeAudio_Unauthorized() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "answer.webm", "audio/webm", "audio bytes".getBytes());

        when(restTemplate.postForEntity(anyString(), any(), eq(String.class)))
                .thenThrow(new HttpClientErrorException(HttpStatus.UNAUTHORIZED, "Unauthorized"));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                elevenLabsSttService.transcribeAudio(file));
        assertTrue(ex.getMessage().contains("Authentication failed"));
    }

    @Test
    void testTranscribeAudio_Timeout() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "answer.webm", "audio/webm", "audio bytes".getBytes());

        when(restTemplate.postForEntity(anyString(), any(), eq(String.class)))
                .thenThrow(new ResourceAccessException("Read timed out"));

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                elevenLabsSttService.transcribeAudio(file));
        assertTrue(ex.getMessage().contains("timed out"));
    }

    @Test
    void testTranscribeAudio_UpstreamServerError() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "answer.webm", "audio/webm", "audio bytes".getBytes());

        when(restTemplate.postForEntity(anyString(), any(), eq(String.class)))
                .thenThrow(new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR, "Service error"));

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                elevenLabsSttService.transcribeAudio(file));
        assertTrue(ex.getMessage().contains("Speech-to-Text provider encountered an error"));
    }
}


package com.intervai.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@Slf4j
@RequiredArgsConstructor
public class ElevenLabsSttService {

    @Value("${intervai.elevenlabs.api-key:}")
    private String apiKey;

    @Value("${intervai.elevenlabs.stt-model-id:scribe_v2}")
    private String modelId;

    @Value("${intervai.elevenlabs.api-url:https://api.elevenlabs.io/v1/speech-to-text}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public record TranscriptionResult(String text, String languageCode) {}

    public TranscriptionResult transcribeAudio(MultipartFile audioFile) {
        if (audioFile == null || audioFile.isEmpty()) {
            throw new IllegalArgumentException("Audio file cannot be empty");
        }

        // Limit audio size to 25MB for speech answer submissions
        long maxSizeBytes = 25 * 1024 * 1024;
        if (audioFile.getSize() > maxSizeBytes) {
            throw new IllegalArgumentException("Audio file exceeds maximum allowed size of 25MB");
        }

        if (apiKey == null || apiKey.trim().isEmpty()) {
            log.warn("ElevenLabs API key is not configured. Returning local development transcript fallback.");
            return new TranscriptionResult(
                    "This is a local transcription preview. To enable live ElevenLabs transcription, configure ELEVENLABS_API_KEY in your backend environment.",
                    "en"
            );
        }

        String name = audioFile.getOriginalFilename();
        if (name == null || name.isBlank()) {
            name = "recording.webm";
        }
        final String effectiveFilename = name;

        byte[] audioBytes;
        try {
            audioBytes = audioFile.getBytes();
        } catch (IOException e) {
            log.error("Failed to read audio file bytes: {}", e.getMessage());
            throw new IllegalArgumentException("Failed to read uploaded audio file");
        }

        if (audioBytes.length == 0) {
            throw new IllegalArgumentException("Audio file contains no data");
        }

        // Prepare multipart payload for ElevenLabs API
        ByteArrayResource fileResource = new ByteArrayResource(audioBytes) {
            @Override
            public String getFilename() {
                return effectiveFilename;
            }
        };

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", fileResource);
        body.add("model_id", (modelId != null && !modelId.isBlank()) ? modelId.trim() : "scribe_v2");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.set("xi-api-key", apiKey.trim());

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            log.info("Sending audio transcription request to ElevenLabs Scribe API. File size: {} bytes, model: {}",
                    audioBytes.length, modelId);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, requestEntity, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                log.error("ElevenLabs API returned non-success status: {}", response.getStatusCode());
                throw new RuntimeException("Transcription failed: upstream service returned " + response.getStatusCode());
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            String text = root.path("text").asText("");
            String languageCode = root.path("language_code").asText("en");

            return new TranscriptionResult(text.trim(), languageCode);

        } catch (HttpStatusCodeException ex) {
            log.error("ElevenLabs STT API HTTP error status {}: {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            if (ex.getStatusCode() == HttpStatus.UNAUTHORIZED || ex.getStatusCode() == HttpStatus.FORBIDDEN) {
                throw new IllegalStateException("Authentication failed with Speech-to-Text provider");
            } else if (ex.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                throw new RuntimeException("Speech-to-Text rate limit exceeded. Please try again shortly.");
            } else if (ex.getStatusCode().is4xxClientError()) {
                throw new IllegalArgumentException("Audio format rejected or unprocessable by speech service");
            } else {
                throw new RuntimeException("Speech-to-Text provider encountered an error");
            }
        } catch (ResourceAccessException ex) {
            log.error("ElevenLabs STT API network/timeout error: {}", ex.getMessage());
            throw new RuntimeException("Speech-to-Text service timed out. Please retry.");
        } catch (Exception ex) {
            log.error("Unexpected error during ElevenLabs audio transcription: {}", ex.getMessage());
            throw new RuntimeException("Audio transcription failed: " + ex.getMessage(), ex);
        }
    }
}


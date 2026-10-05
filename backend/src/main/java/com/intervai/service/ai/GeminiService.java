package com.intervai.service.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class GeminiService {

    @Value("${intervai.gemini.api-key}")
    private String apiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateContent(String systemInstruction, String userPrompt) {
        String url = GEMINI_API_URL + "?key=" + apiKey;

        Map<String, Object> requestBody = new HashMap<>();
        
        if (systemInstruction != null && !systemInstruction.isEmpty()) {
            Map<String, Object> systemPart = new HashMap<>();
            systemPart.put("text", systemInstruction);
            Map<String, Object> systemInstructionObj = new HashMap<>();
            systemInstructionObj.put("parts", Collections.singletonList(systemPart));
            requestBody.put("system_instruction", systemInstructionObj);
        }

        Map<String, Object> userPart = new HashMap<>();
        userPart.put("text", userPrompt);
        Map<String, Object> contents = new HashMap<>();
        contents.put("parts", Collections.singletonList(userPart));
        
        requestBody.put("contents", Collections.singletonList(contents));
        
        // Ensure response is JSON
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("response_mime_type", "application/json");
        requestBody.put("generationConfig", generationConfig);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to generate content from Gemini API: {}", e.getMessage());
            throw new RuntimeException("AI processing failed", e);
        }
        
        throw new RuntimeException("Invalid response from AI provider");
    }
}

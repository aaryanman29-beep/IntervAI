package com.intervai.service.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoadmapGenerator {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public List<Map<String, Object>> generateRoadmap(String targetRole, String skills, String weakAreas) {
        String systemInstruction = "You are an expert career coach and technical mentor. " +
                "Generate a learning roadmap based on the candidate's target role, current skills, and weak areas. " +
                "DO NOT include markdown, return ONLY valid JSON.\n" +
                "Required format:\n" +
                "[\n" +
                "  {\n" +
                "    \"topic\": \"string\",\n" +
                "    \"priority\": \"HIGH\" or \"MEDIUM\" or \"LOW\",\n" +
                "    \"description\": \"string\",\n" +
                "    \"recommendedResources\": [\"resource 1 (link or title)\", \"resource 2\"]\n" +
                "  }\n" +
                "]";

        String userPrompt = String.format("Role: %s\nSkills: %s\nWeak Areas: %s", targetRole, skills, weakAreas);

        try {
            String jsonResponse = geminiService.generateContent(systemInstruction, userPrompt);
            jsonResponse = cleanJson(jsonResponse);
            return objectMapper.readValue(jsonResponse, List.class);
        } catch (Exception e) {
            log.error("Failed to parse AI generated roadmap: {}", e.getMessage());
            throw new RuntimeException("Could not generate roadmap via AI", e);
        }
    }
    
    private String cleanJson(String jsonResponse) {
        if (jsonResponse.startsWith("```json")) {
            jsonResponse = jsonResponse.substring(7);
            if (jsonResponse.endsWith("```")) {
                jsonResponse = jsonResponse.substring(0, jsonResponse.length() - 3);
            }
        }
        return jsonResponse;
    }
}

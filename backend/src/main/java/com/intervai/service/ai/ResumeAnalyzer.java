package com.intervai.service.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class ResumeAnalyzer {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public Map<String, Object> analyzeResume(String resumeText) {
        String systemInstruction = "You are an expert ATS (Applicant Tracking System) and senior recruiter. " +
                "Analyze the following resume text and provide a structured JSON response. " +
                "DO NOT include markdown block formatting, return ONLY valid JSON.\n" +
                "Required format:\n" +
                "{\n" +
                "  \"atsScore\": <integer 0-100>,\n" +
                "  \"skills\": [\"skill1\", \"skill2\"],\n" +
                "  \"missingSkills\": [\"missing1\", \"missing2\"],\n" +
                "  \"weakAreas\": [\"weakness1\", \"weakness2\"],\n" +
                "  \"suggestions\": [\"suggestion1\", \"suggestion2\"],\n" +
                "  \"recommendedTopics\": [\"topic1\", \"topic2\"]\n" +
                "}";

        try {
            String jsonResponse = geminiService.generateContent(systemInstruction, resumeText);
            
            // Clean up possible markdown if the AI includes it despite instructions
            if (jsonResponse.startsWith("```json")) {
                jsonResponse = jsonResponse.substring(7);
                if (jsonResponse.endsWith("```")) {
                    jsonResponse = jsonResponse.substring(0, jsonResponse.length() - 3);
                }
            }

            return objectMapper.readValue(jsonResponse, Map.class);
        } catch (Exception e) {
            log.error("Failed to parse AI resume analysis: {}", e.getMessage());
            throw new RuntimeException("Could not analyze resume via AI", e);
        }
    }
}

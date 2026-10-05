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
public class QuestionGenerator {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public List<Map<String, Object>> generateQuestions(
            String targetRole, String experienceLevel, String interviewType,
            String company, String resumeSkills) {
        
        String systemInstruction = "You are an expert technical interviewer and HR manager. " +
                "Generate a list of exactly 5 interview questions based on the candidate's profile. " +
                "DO NOT include markdown, return ONLY valid JSON.\n" +
                "Required format:\n" +
                "[\n" +
                "  {\n" +
                "    \"questionText\": \"string\",\n" +
                "    \"questionType\": \"HR\" or \"TECHNICAL\" or \"BEHAVIORAL\",\n" +
                "    \"difficulty\": \"EASY\" or \"MEDIUM\" or \"HARD\",\n" +
                "    \"topic\": \"string\"\n" +
                "  }\n" +
                "]";

        String userPrompt = String.format(
                "Role: %s\nExperience: %s\nInterview Type: %s\nCompany: %s\nCandidate Skills: %s",
                targetRole, experienceLevel, interviewType, company, resumeSkills);

        try {
            String jsonResponse = geminiService.generateContent(systemInstruction, userPrompt);
            jsonResponse = cleanJson(jsonResponse);
            return objectMapper.readValue(jsonResponse, List.class);
        } catch (Exception e) {
            log.error("Failed to parse AI generated questions: {}", e.getMessage());
            throw new RuntimeException("Could not generate questions via AI", e);
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

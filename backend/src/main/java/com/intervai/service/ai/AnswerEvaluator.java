package com.intervai.service.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class AnswerEvaluator {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public Map<String, Object> evaluateAnswer(
            String questionText, String answerText, String targetRole, String experienceLevel) {
        
        String systemInstruction = "You are an expert technical interviewer evaluating a candidate's answer. " +
                "Provide a structured JSON evaluation. " +
                "DO NOT include markdown, return ONLY valid JSON.\n" +
                "Required format:\n" +
                "{\n" +
                "  \"score\": <0-100>,\n" +
                "  \"correctnessScore\": <0-100>,\n" +
                "  \"clarityScore\": <0-100>,\n" +
                "  \"technicalDepthScore\": <0-100>,\n" +
                "  \"strengths\": [\"strength1\"],\n" +
                "  \"weaknesses\": [\"weakness1\"],\n" +
                "  \"feedback\": \"detailed feedback\",\n" +
                "  \"needsFollowUp\": true|false,\n" +
                "  \"followUpQuestion\": {\n" +
                "    \"questionText\": \"string\",\n" +
                "    \"questionType\": \"string\",\n" +
                "    \"difficulty\": \"string\",\n" +
                "    \"topic\": \"string\"\n" +
                "  } // ONLY include if needsFollowUp is true, otherwise null\n" +
                "}";

        String userPrompt = String.format(
                "Role: %s\nExperience: %s\nQuestion: %s\nCandidate Answer: %s",
                targetRole, experienceLevel, questionText, answerText);

        try {
            String jsonResponse = geminiService.generateContent(systemInstruction, userPrompt);
            jsonResponse = cleanJson(jsonResponse);
            return objectMapper.readValue(jsonResponse, Map.class);
        } catch (Exception e) {
            log.error("Failed to parse AI evaluation: {}", e.getMessage());
            throw new RuntimeException("Could not evaluate answer via AI", e);
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

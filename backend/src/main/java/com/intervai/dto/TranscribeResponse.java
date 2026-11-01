package com.intervai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TranscribeResponse {
    private String transcript;
    private String answerId;
    private String questionId;
    private String sessionId;
    private String detectedLanguage;
    private Boolean evaluated;
    private Map<String, Object> evaluation;
}


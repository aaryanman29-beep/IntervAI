package com.intervai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SubmitAnswerRequest {
    @NotBlank
    private String answerText;
    
    @NotBlank
    private String questionId;
}

package com.intervai.dto;

import com.intervai.entity.InterviewType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateInterviewRequest {
    @NotBlank
    private String targetRole;
    
    @NotBlank
    private String experienceLevel;
    
    @NotNull
    private InterviewType interviewType;
    
    private String company;
    private String resumeId;
}

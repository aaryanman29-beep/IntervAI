package com.intervai.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardResponse {
    private int overallScore;
    private int technicalScore;
    private int hrScore;
    private int codingScore;
    private int communicationScore;
    
    private List<String> strengths;
    private List<String> weakAreas;
    
    private int totalInterviews;
}

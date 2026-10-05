package com.intervai.service;

import com.intervai.dto.DashboardResponse;
import com.intervai.entity.Interview;
import com.intervai.entity.InterviewStatus;
import com.intervai.repository.InterviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Set;
import java.util.HashSet;
import java.util.ArrayList;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final InterviewRepository interviewRepository;
    private final ObjectMapper objectMapper;

    public DashboardResponse getDashboardData(String userId) {
        List<Interview> allInterviews = interviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        List<Interview> completed = allInterviews.stream()
                .filter(i -> i.getStatus() == InterviewStatus.COMPLETED)
                .collect(Collectors.toList());

        if (completed.isEmpty()) {
            return DashboardResponse.builder()
                    .totalInterviews(allInterviews.size())
                    .overallScore(0)
                    .technicalScore(0)
                    .hrScore(0)
                    .communicationScore(0)
                    .codingScore(0)
                    .strengths(List.of())
                    .weakAreas(List.of())
                    .build();
        }

        int count = completed.size();
        int overallScore = completed.stream().mapToInt(i -> i.getOverallScore() == null ? 0 : i.getOverallScore()).sum() / count;
        int technicalScore = completed.stream().mapToInt(i -> i.getTechnicalScore() == null ? 0 : i.getTechnicalScore()).sum() / count;
        int hrScore = completed.stream().mapToInt(i -> i.getHrScore() == null ? 0 : i.getHrScore()).sum() / count;
        int communicationScore = completed.stream().mapToInt(i -> i.getCommunicationScore() == null ? 0 : i.getCommunicationScore()).sum() / count;

        Set<String> aggregatedStrengths = new HashSet<>();
        Set<String> aggregatedWeakAreas = new HashSet<>();
        
        for (Interview i : completed) {
            if (i.getStrengths() != null) {
                try {
                    List<String> s = objectMapper.readValue(i.getStrengths(), new TypeReference<List<String>>() {});
                    if (s != null) aggregatedStrengths.addAll(s);
                } catch(Exception e) {}
            }
            if (i.getWeakAreas() != null) {
                try {
                    List<String> w = objectMapper.readValue(i.getWeakAreas(), new TypeReference<List<String>>() {});
                    if (w != null) aggregatedWeakAreas.addAll(w);
                } catch(Exception e) {}
            }
        }

        return DashboardResponse.builder()
                .totalInterviews(allInterviews.size())
                .overallScore(overallScore)
                .technicalScore(technicalScore)
                .hrScore(hrScore)
                .communicationScore(communicationScore)
                .codingScore(0)
                .strengths(new ArrayList<>(aggregatedStrengths))
                .weakAreas(new ArrayList<>(aggregatedWeakAreas))
                .build();
    }
}

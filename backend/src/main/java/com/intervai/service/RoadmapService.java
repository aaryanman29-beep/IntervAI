package com.intervai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.intervai.entity.LearningRoadmap;
import com.intervai.entity.User;
import com.intervai.repository.LearningRoadmapRepository;
import com.intervai.repository.UserRepository;
import com.intervai.service.ai.RoadmapGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoadmapService {

    private final LearningRoadmapRepository roadmapRepository;
    private final UserRepository userRepository;
    private final RoadmapGenerator roadmapGenerator;
    private final ObjectMapper objectMapper;

    public List<LearningRoadmap> getUserRoadmap(String userId) {
        return roadmapRepository.findByUserId(userId);
    }

    @Transactional
    public List<LearningRoadmap> generateRoadmap(String userId, String targetRole, String skills, String weakAreas) {
        User user = userRepository.findById(userId).orElseThrow();
        
        List<Map<String, Object>> aiRoadmap = roadmapGenerator.generateRoadmap(targetRole, skills, weakAreas);

        // Delete existing roadmap
        List<LearningRoadmap> existing = roadmapRepository.findByUserId(userId);
        roadmapRepository.deleteAll(existing);

        for (Map<String, Object> item : aiRoadmap) {
            try {
                LearningRoadmap roadmap = LearningRoadmap.builder()
                        .user(user)
                        .topic((String) item.get("topic"))
                        .priority((String) item.get("priority"))
                        .description((String) item.get("description"))
                        .status("NOT_STARTED")
                        .progress(0)
                        .recommendedResources(objectMapper.writeValueAsString(item.get("recommendedResources")))
                        .build();
                roadmapRepository.save(roadmap);
            } catch (JsonProcessingException e) {
                log.error("Failed to serialize recommended resources", e);
            }
        }
        
        return roadmapRepository.findByUserId(userId);
    }
}

package com.intervai.controller;

import com.intervai.dto.ApiResponse;
import com.intervai.dto.DashboardResponse;
import com.intervai.entity.LearningRoadmap;
import com.intervai.security.UserDetailsImpl;
import com.intervai.service.DashboardService;
import com.intervai.service.RoadmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final RoadmapService roadmapService;
    private final com.intervai.security.RateLimiterService rateLimiterService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        DashboardResponse data = dashboardService.getDashboardData(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(data, "Dashboard data fetched successfully"));
    }

    @GetMapping("/roadmap")
    public ResponseEntity<ApiResponse<List<LearningRoadmap>>> getRoadmap(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<LearningRoadmap> roadmap = roadmapService.getUserRoadmap(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(roadmap, "Roadmap fetched successfully"));
    }
    
    @PostMapping("/roadmap/generate")
    public ResponseEntity<ApiResponse<List<LearningRoadmap>>> generateRoadmap(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, String> request) {

        // Rate limit: max 3 roadmap generations per 5 minutes per user
        String rateKey = "roadmap:" + userDetails.getId();
        if (!rateLimiterService.tryAcquire(rateKey, 3, 300_000)) {
            return ResponseEntity.status(429)
                    .body(ApiResponse.error("Too many roadmap generations requested. Please try again in 5 minutes.", "RATE_LIMIT_EXCEEDED"));
        }

        List<LearningRoadmap> roadmap = roadmapService.generateRoadmap(
                userDetails.getId(), 
                request.getOrDefault("targetRole", "Software Engineer"), 
                request.getOrDefault("skills", "Java, React"), 
                request.getOrDefault("weakAreas", "System Design"));
        return ResponseEntity.ok(ApiResponse.success(roadmap, "Roadmap generated successfully"));
    }
}

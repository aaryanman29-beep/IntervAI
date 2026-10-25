package com.intervai.controller;

import com.intervai.dto.ApiResponse;
import com.intervai.entity.Resume;
import com.intervai.entity.ResumeAnalysis;
import com.intervai.security.UserDetailsImpl;
import com.intervai.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;
    private final com.intervai.security.RateLimiterService rateLimiterService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Resume>> uploadResume(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam("file") MultipartFile file) {
        
        // Rate limit: max 5 resume uploads per 10 minutes per user
        String rateKey = "resume_upload:" + userDetails.getId();
        if (!rateLimiterService.tryAcquire(rateKey, 5, 600_000)) {
            return ResponseEntity.status(429)
                    .body(ApiResponse.error("Resume upload quota exceeded. Please wait a few minutes.", "RATE_LIMIT_EXCEEDED"));
        }

        Resume resume = resumeService.uploadResume(userDetails.getId(), file);
        return ResponseEntity.ok(ApiResponse.success(resume, "Resume uploaded successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Resume>>> getUserResumes(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Resume> resumes = resumeService.getUserResumes(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(resumes, "Resumes fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Resume>> getResume(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String id) {
        Resume resume = resumeService.getResume(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(resume, "Resume fetched successfully"));
    }

    @PostMapping("/{id}/analyze")
    public ResponseEntity<ApiResponse<ResumeAnalysis>> analyzeResume(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String id) {

        // Rate limit: max 5 AI analysis runs per 10 minutes per user
        String rateKey = "resume_analyze:" + userDetails.getId();
        if (!rateLimiterService.tryAcquire(rateKey, 5, 600_000)) {
            return ResponseEntity.status(429)
                    .body(ApiResponse.error("Resume analysis rate limit exceeded. Please wait.", "RATE_LIMIT_EXCEEDED"));
        }

        ResumeAnalysis analysis = resumeService.analyzeResume(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(analysis, "Resume analyzed successfully"));
    }
}

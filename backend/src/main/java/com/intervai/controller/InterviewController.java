package com.intervai.controller;

import com.intervai.dto.ApiResponse;
import com.intervai.dto.CreateInterviewRequest;
import com.intervai.dto.SubmitAnswerRequest;
import com.intervai.entity.Answer;
import com.intervai.entity.Interview;
import com.intervai.entity.Question;
import com.intervai.security.UserDetailsImpl;
import com.intervai.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;
    private final com.intervai.security.RateLimiterService rateLimiterService;

    @PostMapping
    public ResponseEntity<ApiResponse<Interview>> createInterview(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CreateInterviewRequest request) {

        // Rate limit: max 5 interview creations per 10 minutes per user
        String rateKey = "create_interview:" + userDetails.getId();
        if (!rateLimiterService.tryAcquire(rateKey, 5, 600_000)) {
            return ResponseEntity.status(429)
                    .body(ApiResponse.error("Interview creation rate limit reached. Please wait before creating another session.", "RATE_LIMIT_EXCEEDED"));
        }

        Interview interview = interviewService.createInterview(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(interview, "Interview created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Interview>>> getUserInterviews(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Interview> interviews = interviewService.getUserInterviews(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(interviews, "Interviews fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Interview>> getInterview(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String id) {
        Interview interview = interviewService.getInterview(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(interview, "Interview fetched successfully"));
    }

    @GetMapping("/{id}/questions")
    public ResponseEntity<ApiResponse<List<Question>>> getInterviewQuestions(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String id) {
        List<Question> questions = interviewService.getInterviewQuestions(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(questions, "Questions fetched successfully"));
    }

    @GetMapping("/questions")
    public ResponseEntity<ApiResponse<List<Question>>> getUserQuestions(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Question> questions = interviewService.getUserQuestions(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(questions, "All questions fetched successfully"));
    }

    @GetMapping("/questions/{questionId}")
    public ResponseEntity<ApiResponse<Question>> getUserQuestion(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String questionId) {
        Question question = interviewService.getUserQuestion(questionId, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(question, "Question fetched successfully"));
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<ApiResponse<Interview>> startInterview(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String id) {
        Interview interview = interviewService.startInterview(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(interview, "Interview started"));
    }

    @PostMapping("/{id}/answer")
    public ResponseEntity<ApiResponse<Answer>> submitAnswer(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String id,
            @Valid @RequestBody SubmitAnswerRequest request) {

        // Rate limit: max 1 answer evaluation every 3 seconds to prevent prompt spam
        String rateKey = "answer:" + userDetails.getId();
        if (!rateLimiterService.tryAcquire(rateKey, 1, 3_000)) {
            return ResponseEntity.status(429)
                    .body(ApiResponse.error("Evaluation in progress. Please wait a moment before submitting.", "RATE_LIMIT_EXCEEDED"));
        }

        Answer answer = interviewService.submitAnswer(userDetails.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success(answer, "Answer evaluated successfully"));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<Interview>> completeInterview(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String id) {
        Interview interview = interviewService.completeInterview(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(interview, "Interview completed"));
    }
}

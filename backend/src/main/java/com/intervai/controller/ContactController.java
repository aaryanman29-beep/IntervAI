package com.intervai.controller;

import com.intervai.dto.ApiResponse;
import com.intervai.dto.ContactRequest;
import com.intervai.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final EmailService emailService;
    private final com.intervai.security.RateLimiterService rateLimiterService;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> submitContact(
            @Valid @RequestBody ContactRequest request,
            jakarta.servlet.http.HttpServletRequest httpRequest) {

        String clientIp = httpRequest.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.trim().isEmpty()) {
            clientIp = httpRequest.getRemoteAddr();
        }

        String rateKey = "contact:" + clientIp + ":" + request.getEmail().toLowerCase().trim();

        // 3 contact submissions max per 2 minutes per IP + email
        if (!rateLimiterService.tryAcquire(rateKey, 3, 120_000)) {
            return ResponseEntity.status(429)
                    .body(ApiResponse.error("Too many inquiries sent. Please wait before submitting again.", "RATE_LIMIT_EXCEEDED"));
        }

        boolean sent = emailService.sendContactInquiry(request);
        if (!sent) {
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Failed to process message notification.", "EMAIL_DISPATCH_FAILURE"));
        }

        return ResponseEntity.ok(ApiResponse.success("success", "Message received successfully. Our team will contact you soon."));
    }
}

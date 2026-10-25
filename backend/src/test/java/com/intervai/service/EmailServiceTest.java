package com.intervai.service;

import com.intervai.dto.ContactRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {

    @InjectMocks
    private EmailService emailService;

    @Test
    void testSendContactInquiry_Success() {
        ContactRequest request = ContactRequest.builder()
                .name("Jane Doe")
                .email("jane@example.com")
                .subject("Enterprise Platform Inquiry")
                .message("We would like to trial IntervAI for our technical interviewing rounds.")
                .build();

        boolean result = emailService.sendContactInquiry(request);
        assertTrue(result);
    }
}

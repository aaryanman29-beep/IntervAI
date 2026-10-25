package com.intervai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.intervai.dto.ContactRequest;
import com.intervai.service.EmailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ContactControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private EmailService emailService;

    @Test
    void testSubmitContact_Success() throws Exception {
        ContactRequest request = new ContactRequest();
        request.setName("Sarah Connor");
        request.setEmail("sarah@example.com");
        request.setSubject("Interview Simulation Feedback");
        request.setMessage("The AI mock interview was great! How can I request additional system design prompts?");

        when(emailService.sendContactInquiry(any(ContactRequest.class))).thenReturn(true);

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Message received successfully. Our team will contact you soon."));
    }

    @Test
    void testSubmitContact_ValidationFailure_InvalidEmail() throws Exception {
        ContactRequest request = new ContactRequest();
        request.setName("Sarah");
        request.setEmail("not-an-email");
        request.setSubject("Hi");
        request.setMessage("Too short");

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is4xxClientError());
    }
}

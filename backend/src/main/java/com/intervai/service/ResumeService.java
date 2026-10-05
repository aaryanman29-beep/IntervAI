package com.intervai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.intervai.entity.Resume;
import com.intervai.entity.ResumeAnalysis;
import com.intervai.entity.User;
import com.intervai.exception.ResourceNotFoundException;
import com.intervai.repository.ResumeAnalysisRepository;
import com.intervai.repository.ResumeRepository;
import com.intervai.repository.UserRepository;
import com.intervai.service.ai.ResumeAnalyzer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import org.apache.pdfbox.Loader;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final ResumeAnalyzer resumeAnalyzer;
    private final ObjectMapper objectMapper;

    @Transactional
    public Resume uploadResume(String userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (file.isEmpty() || !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Invalid file format. Only PDF is supported.");
        }

        String filePath = fileStorageService.storeFile(file);
        
        String extractedText;
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            extractedText = stripper.getText(document);
        } catch (IOException e) {
            log.error("Failed to extract text from PDF: {}", e.getMessage());
            extractedText = "TEXT_EXTRACTION_FAILED";
        }

        Resume resume = Resume.builder()
                .user(user)
                .filename(Paths.get(filePath).getFileName().toString())
                .originalFilename(file.getOriginalFilename())
                .filePath(filePath)
                .contentType(file.getContentType())
                .sizeBytes(file.getSize())
                .extractedText(extractedText)
                .build();

        return resumeRepository.save(resume);
    }

    public List<Resume> getUserResumes(String userId) {
        return resumeRepository.findByUserId(userId);
    }

    public Resume getResume(String id, String userId) {
        return resumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found or not owned by user"));
    }

    @Transactional
    public ResumeAnalysis analyzeResume(String resumeId, String userId) {
        Resume resume = getResume(resumeId, userId);
        
        // Return existing analysis if already done
        resumeAnalysisRepository.findByResumeId(resumeId).ifPresent(analysis -> {
            throw new IllegalArgumentException("Resume already analyzed");
        });

        if ("TEXT_EXTRACTION_FAILED".equals(resume.getExtractedText()) || resume.getExtractedText() == null) {
            throw new IllegalArgumentException("Cannot analyze resume without text content");
        }

        Map<String, Object> aiResult = resumeAnalyzer.analyzeResume(resume.getExtractedText());

        try {
            ResumeAnalysis analysis = ResumeAnalysis.builder()
                    .resume(resume)
                    .atsScore((Integer) aiResult.getOrDefault("atsScore", 0))
                    .skills(objectMapper.writeValueAsString(aiResult.get("skills")))
                    .missingSkills(objectMapper.writeValueAsString(aiResult.get("missingSkills")))
                    .weakAreas(objectMapper.writeValueAsString(aiResult.get("weakAreas")))
                    .suggestions(objectMapper.writeValueAsString(aiResult.get("suggestions")))
                    .recommendedTopics(objectMapper.writeValueAsString(aiResult.get("recommendedTopics")))
                    .build();

            return resumeAnalysisRepository.save(analysis);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to save analysis result", e);
        }
    }
}

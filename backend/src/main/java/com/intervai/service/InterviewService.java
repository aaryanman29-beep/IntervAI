package com.intervai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.intervai.dto.CreateInterviewRequest;
import com.intervai.dto.SubmitAnswerRequest;
import com.intervai.entity.*;
import com.intervai.exception.ResourceNotFoundException;
import com.intervai.repository.*;
import com.intervai.service.ai.AnswerEvaluator;
import com.intervai.service.ai.QuestionGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final QuestionGenerator questionGenerator;
    private final AnswerEvaluator answerEvaluator;
    private final ObjectMapper objectMapper;

    @Transactional
    public Interview createInterview(String userId, CreateInterviewRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        Resume resume = null;
        String resumeSkills = "None provided";

        if (request.getResumeId() != null) {
            resume = resumeRepository.findByIdAndUserId(request.getResumeId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
            
            var analysis = resumeAnalysisRepository.findByResumeId(resume.getId());
            if (analysis.isPresent()) {
                resumeSkills = analysis.get().getSkills();
            }
        }

        Interview interview = Interview.builder()
                .user(user)
                .resume(resume)
                .targetRole(request.getTargetRole())
                .experienceLevel(request.getExperienceLevel())
                .interviewType(request.getInterviewType())
                .company(request.getCompany())
                .status(InterviewStatus.CREATED)
                .build();
        
        interview = interviewRepository.save(interview);

        // Generate initial questions via AI
        List<Map<String, Object>> aiQuestions = questionGenerator.generateQuestions(
                request.getTargetRole(), request.getExperienceLevel(), 
                request.getInterviewType().name(), request.getCompany(), resumeSkills);

        int order = 1;
        for (Map<String, Object> qData : aiQuestions) {
            Question q = Question.builder()
                    .interview(interview)
                    .questionText((String) qData.get("questionText"))
                    .questionType(QuestionType.valueOf((String) qData.get("questionType")))
                    .difficulty(Difficulty.valueOf((String) qData.get("difficulty")))
                    .topic((String) qData.get("topic"))
                    .questionOrder(order++)
                    .isFollowUp(false)
                    .build();
            questionRepository.save(q);
        }

        return interview;
    }

    public List<Interview> getUserInterviews(String userId) {
        return interviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Interview getInterview(String id, String userId) {
        return interviewRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
    }

    public List<Question> getInterviewQuestions(String interviewId, String userId) {
        getInterview(interviewId, userId); // verify ownership
        return questionRepository.findByInterviewIdOrderByQuestionOrderAsc(interviewId);
    }

    public List<Question> getUserQuestions(String userId) {
        return questionRepository.findByInterviewUserId(userId);
    }

    public Question getUserQuestion(String questionId, String userId) {
        Question q = questionRepository.findById(questionId)
            .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        if (!q.getInterview().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Question does not belong to user");
        }
        return q;
    }

    @Transactional
    public Interview startInterview(String id, String userId) {
        Interview interview = getInterview(id, userId);
        if (interview.getStatus() != InterviewStatus.CREATED) {
            throw new IllegalArgumentException("Interview already started or completed");
        }
        interview.setStatus(InterviewStatus.IN_PROGRESS);
        return interviewRepository.save(interview);
    }

    @Transactional
    public Answer submitAnswer(String userId, String interviewId, SubmitAnswerRequest request) {
        Interview interview = getInterview(interviewId, userId);
        if (interview.getStatus() != InterviewStatus.IN_PROGRESS) {
            throw new IllegalArgumentException("Interview is not in progress");
        }

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        
        if (!question.getInterview().getId().equals(interviewId)) {
            throw new IllegalArgumentException("Question does not belong to this interview");
        }

        if (answerRepository.findByQuestionId(question.getId()).isPresent()) {
            throw new IllegalArgumentException("Answer already submitted for this question");
        }

        // Evaluate answer
        Map<String, Object> evaluation = answerEvaluator.evaluateAnswer(
                question.getQuestionText(), request.getAnswerText(), 
                interview.getTargetRole(), interview.getExperienceLevel());

        Answer answer = new Answer();
        try {
            answer = Answer.builder()
                    .question(question)
                    .answerText(request.getAnswerText())
                    .score((Integer) evaluation.get("score"))
                    .correctnessScore((Integer) evaluation.get("correctnessScore"))
                    .clarityScore((Integer) evaluation.get("clarityScore"))
                    .technicalDepthScore((Integer) evaluation.get("technicalDepthScore"))
                    .strengths(objectMapper.writeValueAsString(evaluation.get("strengths")))
                    .weaknesses(objectMapper.writeValueAsString(evaluation.get("weaknesses")))
                    .feedback((String) evaluation.get("feedback"))
                    .build();
            answer = answerRepository.save(answer);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error processing AI evaluation", e);
        }

        // Adaptive Follow up
        if (Boolean.TRUE.equals(evaluation.get("needsFollowUp")) && evaluation.get("followUpQuestion") != null) {
            Map<String, Object> fq = (Map<String, Object>) evaluation.get("followUpQuestion");
            List<Question> existing = questionRepository.findByInterviewIdOrderByQuestionOrderAsc(interviewId);
            int maxOrder = existing.stream().mapToInt(Question::getQuestionOrder).max().orElse(0);

            Question followUp = Question.builder()
                    .interview(interview)
                    .parentQuestion(question)
                    .questionText((String) fq.get("questionText"))
                    .questionType(QuestionType.valueOf((String) fq.get("questionType")))
                    .difficulty(Difficulty.valueOf((String) fq.get("difficulty")))
                    .topic((String) fq.get("topic"))
                    .questionOrder(maxOrder + 1)
                    .isFollowUp(true)
                    .build();
            questionRepository.save(followUp);
        }

        return answer;
    }

    @Transactional
    public Interview completeInterview(String id, String userId) {
        Interview interview = getInterview(id, userId);
        if (interview.getStatus() != InterviewStatus.IN_PROGRESS) {
            throw new IllegalArgumentException("Cannot complete interview from current state");
        }

        List<Question> questions = questionRepository.findByInterviewIdOrderByQuestionOrderAsc(id);
        List<Answer> answers = questions.stream()
                .map(q -> answerRepository.findByQuestionId(q.getId()).orElse(null))
                .filter(a -> a != null)
                .collect(Collectors.toList());

        if (answers.isEmpty()) {
            interview.setOverallScore(0);
        } else {
            int totalScore = answers.stream().mapToInt(Answer::getScore).sum();
            int totalCorrectness = answers.stream().mapToInt(Answer::getCorrectnessScore).sum();
            int totalClarity = answers.stream().mapToInt(Answer::getClarityScore).sum();
            int totalDepth = answers.stream().mapToInt(Answer::getTechnicalDepthScore).sum();
            int count = answers.size();

            interview.setOverallScore(totalScore / count);
            interview.setTechnicalScore(totalDepth / count);
            interview.setHrScore(totalCorrectness / count);
            interview.setCommunicationScore(totalClarity / count);
            
            // Aggregate strengths and weaknesses from answers
            try {
                java.util.Set<String> allStrengths = new java.util.HashSet<>();
                java.util.Set<String> allWeaknesses = new java.util.HashSet<>();
                for (Answer a : answers) {
                    if (a.getStrengths() != null) {
                        try {
                            List<String> s = objectMapper.readValue(a.getStrengths(), new com.fasterxml.jackson.core.type.TypeReference<List<String>>() {});
                            if (s != null) allStrengths.addAll(s);
                        } catch(Exception e) {}
                    }
                    if (a.getWeaknesses() != null) {
                        try {
                            List<String> w = objectMapper.readValue(a.getWeaknesses(), new com.fasterxml.jackson.core.type.TypeReference<List<String>>() {});
                            if (w != null) allWeaknesses.addAll(w);
                        } catch(Exception e) {}
                    }
                }
                interview.setStrengths(objectMapper.writeValueAsString(new java.util.ArrayList<>(allStrengths)));
                interview.setWeakAreas(objectMapper.writeValueAsString(new java.util.ArrayList<>(allWeaknesses)));
            } catch (Exception ignored) {}
        }

        interview.setStatus(InterviewStatus.COMPLETED);
        return interviewRepository.save(interview);
    }
}

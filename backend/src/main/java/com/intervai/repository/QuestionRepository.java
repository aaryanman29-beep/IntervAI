package com.intervai.repository;

import com.intervai.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, String> {
    List<Question> findByInterviewIdOrderByQuestionOrderAsc(String interviewId);
    List<Question> findByInterviewUserId(String userId);
}

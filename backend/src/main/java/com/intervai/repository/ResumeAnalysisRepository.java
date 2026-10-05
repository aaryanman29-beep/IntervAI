package com.intervai.repository;

import com.intervai.entity.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, String> {
    Optional<ResumeAnalysis> findByResumeId(String resumeId);
}

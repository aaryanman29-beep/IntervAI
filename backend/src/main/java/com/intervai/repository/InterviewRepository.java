package com.intervai.repository;

import com.intervai.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, String> {
    List<Interview> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<Interview> findByIdAndUserId(String id, String userId);
}

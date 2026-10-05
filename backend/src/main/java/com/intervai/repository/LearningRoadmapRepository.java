package com.intervai.repository;

import com.intervai.entity.LearningRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningRoadmapRepository extends JpaRepository<LearningRoadmap, String> {
    List<LearningRoadmap> findByUserId(String userId);
}

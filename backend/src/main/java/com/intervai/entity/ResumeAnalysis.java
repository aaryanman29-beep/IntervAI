package com.intervai.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;
import java.time.LocalDateTime;

@Entity
@Table(name = "resume_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeAnalysis {
    @Id
    @UuidGenerator
    @Column(length = 36, updatable = false, nullable = false)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @Column(name = "ats_score", nullable = false)
    private Integer atsScore;

    @Column(columnDefinition = "JSON")
    private String skills;

    @Column(name = "missing_skills", columnDefinition = "JSON")
    private String missingSkills;

    @Column(name = "weak_areas", columnDefinition = "JSON")
    private String weakAreas;

    @Column(columnDefinition = "JSON")
    private String suggestions;

    @Column(name = "recommended_topics", columnDefinition = "JSON")
    private String recommendedTopics;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}

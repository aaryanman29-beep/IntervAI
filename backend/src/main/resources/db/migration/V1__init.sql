CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE resumes (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    extracted_text LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE resume_analyses (
    id VARCHAR(36) PRIMARY KEY,
    resume_id VARCHAR(36) NOT NULL,
    ats_score INT NOT NULL,
    skills JSON,
    missing_skills JSON,
    weak_areas JSON,
    suggestions JSON,
    recommended_topics JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);

CREATE TABLE interviews (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    resume_id VARCHAR(36),
    target_role VARCHAR(255) NOT NULL,
    experience_level VARCHAR(50) NOT NULL,
    interview_type VARCHAR(50) NOT NULL,
    company VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    overall_score INT,
    technical_score INT,
    hr_score INT,
    communication_score INT,
    strengths JSON,
    weak_areas JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE SET NULL
);

CREATE TABLE questions (
    id VARCHAR(36) PRIMARY KEY,
    interview_id VARCHAR(36) NOT NULL,
    parent_question_id VARCHAR(36),
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    question_order INT NOT NULL,
    is_follow_up BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE answers (
    id VARCHAR(36) PRIMARY KEY,
    question_id VARCHAR(36) NOT NULL UNIQUE,
    answer_text TEXT NOT NULL,
    score INT,
    correctness_score INT,
    clarity_score INT,
    technical_depth_score INT,
    strengths JSON,
    weaknesses JSON,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE learning_roadmaps (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    progress INT DEFAULT 0,
    recommended_resources JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

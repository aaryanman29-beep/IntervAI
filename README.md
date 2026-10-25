# IntervAI · AI Mock Interview & Career Coaching Platform

<div align="center">

![IntervAI Banner](public/og-image.png)

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1.1-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![MySQL](https://img.shields.io/badge/MySQL-9.x%20%2F%2026.x-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Everything you need to ace your technical, system design, and behavioral interviews.**  
*Live speech-to-text recording, adaptive AI follow-ups, ATS resume matching, and instant multi-dimensional scorecards.*

[Live Demo](https://intervai.app) · [Report Bug](https://github.com/aaryanman29-beep/IntervAI/issues) · [Request Feature](https://github.com/aaryanman29-beep/IntervAI/issues)

</div>

---

## 📌 Overview

**IntervAI** is a full-stack, enterprise-grade mock interview coaching application modeled after leading tech prep platforms (such as Aced.io / Exponent). It bridges the gap between static practice problems and actual high-pressure interview loops by pairing real-time audio interaction with generative AI evaluation.

Whether preparing for **Software Engineering, System Design, Product Management, Machine Learning, or Engineering Leadership**, IntervAI provides realistic mock loops, adaptive follow-ups, and step-by-step career roadmaps.

---

## ✨ Key Features

- **🎙️ Real-Time Audio Practice & Speech Recognition**
  - Continuous speech-to-text with interim preview and audio-level detection.
  - Zero word-duplication streaming pipeline for natural candidate responses.

- **🤖 Adaptive AI Interviewer (Powered by Gemini AI)**
  - Evaluates candidate answers in real-time across four distinct dimensions:
    - **Technical Correctness**
    - **Communication Clarity**
    - **Depth & Edge Case Handling**
    - **Structured Delivery**
  - **Dynamic Follow-ups**: If your answer introduces a trade-off or needs clarification, the AI immediately asks an adaptive follow-up prompt.

- **📄 ATS Resume Intelligence & Skill Extraction**
  - Upload PDF/DOCX resumes to identify technical skills, experience gaps, and compute ATS parse compatibility.
  - Generates custom interview loops targeted directly at your project history.

- **📊 Comprehensive Scorecards & Skill Breakdown**
  - Visual metrics, radar charts, strengths/weaknesses breakdown, and model reference answers.

- **🎯 Curated Question Bank**
  - Searchable by topic, difficulty (*Easy, Medium, Hard*), and track (*System Design, Algorithms, Behavioral, SQL, Machine Learning*).
  - Personal bookmarking and practice state management.

- **✨ Premium Aced-Inspired UI & Micro-Animations**
  - **Dynamic 3D Word Rotator**: Smooth perspective-flip animated headline cycling through practice disciplines.
  - **Endless Horizontal Marquee**: Continuous GPU-accelerated social proof ticker with hover-to-pause and edge fade masks.
  - **Ambient Pulsing Glow Orbs & Shimmer Badges**: Modern visual depth without performance compromise.
  - **Live Audio Wave Equalizer**: Real-time microphone audio activity indicator in interview sessions.

- **🛡️ 9-Pillar Production Security Architecture**
  1. **Zero Client Secrets**: All API keys (`GEMINI_API_KEY`) and secrets (`JWT_SECRET`) reside exclusively server-side.
  2. **Server-Side Business Logic**: Answer evaluations, scoring heuristics, and ATS parsing run in backend services.
  3. **Strict Authentication & Authorization**: Stateless JWT verification with per-resource user ownership enforcement.
  4. **Multi-Tier Rate Limiting & Abuse Protection**:
     - *Login/Register*: Max 5 attempts/min per IP (mitigates credential stuffing/brute force).
     - *Account Lockout*: Auto-lock after 5 consecutive failed login attempts.
     - *Interview Loops*: Max 5 creations / 10 minutes.
     - *AI Evaluations*: Max 1 evaluation per 3 seconds.
     - *Resume Ingestion*: Max 5 uploads / 10 minutes.
  5. **Input Validation & Sanitization**: Jakarta Bean Validation (`@Valid`, `@Pattern`) + PDF magic byte validation.
  6. **Private Internal Database Network**: MySQL container isolated on an `internal: true` bridge network without public port exposure.
  7. **Server-Authoritative Decisions**: Scores (0–100) and roadmap progressions calculated purely server-side.
  8. **HTTPS/TLS & Hardened Headers**: HSTS, CSP, X-Frame-Options (`SAMEORIGIN`), X-Content-Type-Options (`nosniff`).
  9. **Actuator & API Activity Protection**: Actuator health check isolated; sensitive endpoints locked behind `denyAll()`.

---

## 🏗️ Architecture & Tech Stack

```mermaid
graph TD
    Client["React 19 + Vite Frontend<br/>(Tailwind v4 / Recharts / 3D Rotator)"]
    Proxy["Nginx Reverse Proxy<br/>(HTTPS / HSTS / TLS 1.3)"]
    API["Spring Boot 4.1.1 REST API<br/>(Java 21 / Spring Security / Rate Limiter)"]
    DB[("MySQL Database<br/>(Private Internal Network)")]
    AI["Google Gemini 1.5 Flash API<br/>(Generative Model)"]
    
    Client -->|HTTPS / WSS| Proxy
    Proxy -->|Internal Proxy| API
    API -->|Isolated Bridge Network| DB
    API -->|Server-to-Server HTTPS| AI
```

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 with custom Aced.io-inspired design system tokens
- **Typography**: Inter (Body) + Plus Jakarta Sans (Headings) + JetBrains Mono (Code)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Testing**: Vitest + React Testing Library + JSDOM

### Backend
- **Framework**: Spring Boot 4.1.1 (Java 21)
- **Security**: Spring Security 7 + JWT + BCrypt + Custom Rate Limiter
- **Database**: MySQL with Flyway Database Versioning
- **AI Integration**: Google Gemini 1.5 Flash API via Spring RestTemplate + Jackson
- **Build Tool**: Maven (`mvnw` wrapper included)
- **Testing**: JUnit 5 + Mockito + Spring Boot Test

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` (pnpm or npm)
- **Java**: OpenJDK `21`
- **MySQL**: `8.x`, `9.x`, or `26.x`
- **Gemini API Key**: [Google AI Studio](https://aistudio.google.com/) (Optional: graceful fallback included if omitted)

---

### 1. Clone Repository
```bash
git clone https://github.com/aaryanman29-beep/IntervAI.git
cd IntervAI
```

---

### 2. Configure Backend
Create an environment file or export variables:
```bash
# In backend/src/main/resources/application.yml or system environment
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/intervAI?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata"
export SPRING_DATASOURCE_USERNAME="root"
export SPRING_DATASOURCE_PASSWORD="YourPassword"
export JWT_SECRET="your-256-bit-hex-secret-key-at-least-64-characters-long"
export GEMINI_API_KEY="your-gemini-api-key"
```

Start the backend:
```bash
cd backend
./mvnw clean spring-boot:run
```
*Backend runs on `http://localhost:8080`.*

---

### 3. Configure Frontend
In the root directory, create `.env.local`:
```bash
VITE_API_URL=http://localhost:8080/api
```

Install dependencies and start development server:
```bash
npm install
npm run dev
```
*Frontend runs on `http://localhost:8443` (or `http://localhost:5173`).*

---

## 🧪 Testing

### Frontend Tests
```bash
npm run test
```
*Executes unit and integration test suites using Vitest.*

### Backend Tests
```bash
cd backend
./mvnw test
```
*Runs all 16 JUnit 5 / SpringBoot unit and integration tests.*

---

## 🐳 Docker Deployment

A multi-stage `Dockerfile` and `docker-compose.yml` are provided for containerized deployment:

```bash
docker compose up -d --build
```

This spins up:
- **`intervai-frontend`**: Production NGINX web server serving optimized Vite bundle on port `80`/`443`.
- **`intervai-backend`**: Spring Boot container on port `8080`.
- **`intervai-db`**: MySQL container with persistent volume and health check.

---

## 🌐 Production Deployment Options

| Service | Recommended Platform | Notes |
| :--- | :--- | :--- |
| **Frontend** | Vercel / Cloudflare Pages / AWS S3 + CloudFront | Set build command: `npm run build`, output: `dist` |
| **Backend** | AWS ECS / Google Cloud Run / Render / Railway | Containerized Spring Boot JAR |
| **Database** | AWS RDS / PlanetScale / Supabase MySQL | Automated backups and SSL connections |

---

## 🔒 Security & Compliance

- **CORS Configuration**: Restricts access to authorized frontend domains.
- **Data Protection**: Passwords hashed with BCrypt (cost factor 10); JWT tokens stored securely.
- **Input Sanitization**: Strip dangerous HTML and prompt injection vectors before processing.
- **Rate Limiting**: Sliding-window rate limiters prevent endpoint abuse.
- **Cookies & Privacy**: Compliant with GDPR/CCPA with consent banners and privacy preference controls.

---

## 🤝 Contributing

Contributions are always welcome!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'feat: add AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/aaryanman29-beep">Aaryan</a> and the IntervAI Team. Practice with confidence.</sub>
</div>

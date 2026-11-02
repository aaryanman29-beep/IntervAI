# Multi-stage Dockerfile for IntervAI Spring Boot Backend (Optimized for Render & Cloud Deployment)

# Stage 1: Build JAR with Maven Wrapper
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Cache Maven dependencies layer
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x ./mvnw && ./mvnw dependency:go-offline -B

# Copy source code and build executable JAR
COPY src/ src/
RUN ./mvnw clean package -DskipTests

# Stage 2: Minimal, secure JRE Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Security: Non-root application user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && mkdir -p /app/data /app/uploads \
    && chown -R appuser:appgroup /app
USER appuser

# Copy built JAR from Stage 1
COPY --from=builder /app/target/*.jar app.jar

# Render assigns dynamic port at container runtime via $PORT
ENV PORT=8080
EXPOSE 8080

# Dynamic port and host binding via container shell wrapper
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-8080} -Dserver.address=0.0.0.0 -jar app.jar"]

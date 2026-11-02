package com.intervai.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class HealthController {

    private final DataSource dataSource;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> health = new LinkedHashMap<>();
        health.put("service", "intervai-backend");
        health.put("timestamp", Instant.now().toString());

        boolean dbHealthy = checkDatabaseConnectivity();

        if (dbHealthy) {
            health.put("status", "UP");
            health.put("database", "UP");
            return ResponseEntity.ok(health);
        } else {
            health.put("status", "DEGRADED");
            health.put("database", "DOWN");
            health.put("message", "Database connectivity unavailable");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(health);
        }
    }

    private boolean checkDatabaseConnectivity() {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.setQueryTimeout(3); // 3 seconds timeout
            return stmt.execute("SELECT 1");
        } catch (Exception ex) {
            log.error("Database health check probe failed: {}", ex.getMessage());
            return false;
        }
    }
}


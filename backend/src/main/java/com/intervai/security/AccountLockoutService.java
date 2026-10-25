package com.intervai.security;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Account lockout service to prevent brute force credential attacks.
 * Locks account authentication after 5 consecutive failed attempts for 15 minutes.
 */
@Service
public class AccountLockoutService {

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final long LOCK_TIME_DURATION_MS = 15 * 60 * 1000; // 15 minutes

    private static class AttemptTracker {
        int attempts;
        long lockExpiry;

        AttemptTracker(int attempts, long lockExpiry) {
            this.attempts = attempts;
            this.lockExpiry = lockExpiry;
        }
    }

    private final Map<String, AttemptTracker> attemptsMap = new ConcurrentHashMap<>();

    public boolean isLocked(String email) {
        if (email == null) return false;
        String key = email.toLowerCase().trim();
        AttemptTracker tracker = attemptsMap.get(key);
        if (tracker == null) {
            return false;
        }

        if (tracker.lockExpiry > 0) {
            if (System.currentTimeMillis() < tracker.lockExpiry) {
                return true;
            } else {
                // Lock expired, reset
                attemptsMap.remove(key);
                return false;
            }
        }

        return false;
    }

    public void recordFailedAttempt(String email) {
        if (email == null) return;
        String key = email.toLowerCase().trim();
        AttemptTracker tracker = attemptsMap.compute(key, (k, current) -> {
            if (current == null) {
                return new AttemptTracker(1, 0);
            }
            current.attempts++;
            if (current.attempts >= MAX_FAILED_ATTEMPTS) {
                current.lockExpiry = System.currentTimeMillis() + LOCK_TIME_DURATION_MS;
            }
            return current;
        });
    }

    public void resetAttempts(String email) {
        if (email != null) {
            attemptsMap.remove(email.toLowerCase().trim());
        }
    }
}

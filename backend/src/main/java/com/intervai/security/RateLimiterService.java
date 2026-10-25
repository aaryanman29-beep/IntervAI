package com.intervai.security;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory distributed rate limiter implementing token bucket / sliding window
 * with automatic background cleanup to protect against DoS and memory leak attacks.
 */
@Service
public class RateLimiterService {

    private static class RateBucket {
        long windowStart;
        int count;

        RateBucket(long start, int count) {
            this.windowStart = start;
            this.count = count;
        }
    }

    private final Map<String, RateBucket> limiters = new ConcurrentHashMap<>();

    /**
     * Attempts to acquire a rate limit permit for the given key.
     *
     * @param key Identifies client (IP, user ID, or endpoint key)
     * @param maxRequests Maximum allowed requests per window
     * @param windowMs Window duration in milliseconds
     * @return true if request is permitted, false if rate limit exceeded
     */
    public synchronized boolean tryAcquire(String key, int maxRequests, long windowMs) {
        long now = System.currentTimeMillis();
        RateBucket bucket = limiters.get(key);

        if (bucket == null || (now - bucket.windowStart) > windowMs) {
            limiters.put(key, new RateBucket(now, 1));
            cleanupExpiredBuckets(now, windowMs);
            return true;
        }

        if (bucket.count < maxRequests) {
            bucket.count++;
            return true;
        }

        return false;
    }

    private void cleanupExpiredBuckets(long now, long windowMs) {
        if (limiters.size() > 500) {
            limiters.entrySet().removeIf(entry -> (now - entry.getValue().windowStart) > (windowMs * 2));
        }
    }
}

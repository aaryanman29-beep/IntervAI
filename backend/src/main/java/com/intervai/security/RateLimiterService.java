package com.intervai.security;

import org.springframework.stereotype.Service;
import jakarta.annotation.PreDestroy;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * High-throughput lock-free in-memory rate limiter using fine-grained bucket synchronization
 * and asynchronous background bucket eviction to support high concurrent workloads.
 */
@Service
public class RateLimiterService {

    private static class RateBucket {
        volatile long windowStart;
        final AtomicInteger count;

        RateBucket(long start, int initialCount) {
            this.windowStart = start;
            this.count = new AtomicInteger(initialCount);
        }
    }

    private final Map<String, RateBucket> limiters = new ConcurrentHashMap<>();
    private final ScheduledExecutorService cleanupExecutor = Executors.newSingleThreadScheduledExecutor(r -> {
        Thread t = new Thread(r, "RateLimiter-Pruner");
        t.setDaemon(true);
        return t;
    });

    public RateLimiterService() {
        // Asynchronous background cleanup every 60 seconds (zero overhead on user request path)
        cleanupExecutor.scheduleAtFixedRate(this::cleanupExpiredBuckets, 60, 60, TimeUnit.SECONDS);
    }

    /**
     * Attempts to acquire a rate limit permit for the given key.
     * Uses per-key fine-grained concurrency instead of a global method lock.
     *
     * @param key Identifies client (IP, user ID, or endpoint key)
     * @param maxRequests Maximum allowed requests per window
     * @param windowMs Window duration in milliseconds
     * @return true if request is permitted, false if rate limit exceeded
     */
    public boolean tryAcquire(String key, int maxRequests, long windowMs) {
        if (key == null) return true;

        long now = System.currentTimeMillis();
        AtomicBoolean permitted = new AtomicBoolean(false);

        limiters.compute(key, (k, current) -> {
            if (current == null || (now - current.windowStart) > windowMs) {
                permitted.set(true);
                return new RateBucket(now, 1);
            }

            int currentCount = current.count.get();
            if (currentCount < maxRequests) {
                current.count.incrementAndGet();
                permitted.set(true);
            } else {
                permitted.set(false);
            }
            return current;
        });

        return permitted.get();
    }

    private void cleanupExpiredBuckets() {
        long now = System.currentTimeMillis();
        // Remove buckets that have been idle for more than 15 minutes
        long maxIdleMs = 15 * 60 * 1000;
        limiters.entrySet().removeIf(entry -> (now - entry.getValue().windowStart) > maxIdleMs);
    }

    @PreDestroy
    public void shutdown() {
        cleanupExecutor.shutdownNow();
    }
}

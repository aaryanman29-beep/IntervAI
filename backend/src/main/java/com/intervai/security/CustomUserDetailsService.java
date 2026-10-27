package com.intervai.security;

import com.intervai.entity.User;
import com.intervai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    private static class CacheEntry {
        final UserDetails userDetails;
        final long expiresAt;

        CacheEntry(UserDetails userDetails, long expiresAt) {
            this.userDetails = userDetails;
            this.expiresAt = expiresAt;
        }
    }

    private final Map<String, CacheEntry> userCache = new ConcurrentHashMap<>();
    private static final long CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL
    private static final int MAX_CACHE_SIZE = 5000;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        if (email == null) {
            throw new UsernameNotFoundException("Email cannot be null");
        }

        String normalizedEmail = email.toLowerCase().trim();
        long now = System.currentTimeMillis();

        CacheEntry entry = userCache.get(normalizedEmail);
        if (entry != null && entry.expiresAt > now) {
            return entry.userDetails;
        }

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + normalizedEmail));

        UserDetails details = UserDetailsImpl.build(user);

        // Guard against memory leaks
        if (userCache.size() > MAX_CACHE_SIZE) {
            userCache.entrySet().removeIf(e -> e.getValue().expiresAt <= now);
        }

        userCache.put(normalizedEmail, new CacheEntry(details, now + CACHE_TTL_MS));
        return details;
    }

    public void evictUser(String email) {
        if (email != null) {
            userCache.remove(email.toLowerCase().trim());
        }
    }

    public void clearCache() {
        userCache.clear();
    }
}

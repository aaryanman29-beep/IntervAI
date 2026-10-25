package com.intervai.service.ai;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

/**
 * Defensive prompt sanitizer designed to neutralize Prompt Injection, Jailbreaking,
 * and system instruction override attempts.
 */
@Component
public class PromptSanitizer {

    // Patterns matching common prompt injection / jailbreak attempts
    private static final Pattern INJECTION_PATTERN = Pattern.compile(
            "(?i)\\b(ignore all previous instructions|disregard all previous directions|system prompt override|" +
            "you are now in developer mode|bypass guardrails|ignore the above|act as an unrestricted bot|" +
            "print system prompt|output json directly without checking|override rules)\\b"
    );

    /**
     * Sanitizes user-supplied text before embedding it into LLM prompt templates.
     * Enforces character limits, neutralizes markdown delimiters, and flags overt injections.
     */
    public String sanitize(String input, int maxLength) {
        if (input == null || input.trim().isEmpty()) {
            return "None provided";
        }

        String cleaned = input.trim();

        // Enforce maximum input boundary length to prevent token exhaustion DoS
        if (cleaned.length() > maxLength) {
            cleaned = cleaned.substring(0, maxLength);
        }

        // Neutralize explicit prompt injection keywords
        if (INJECTION_PATTERN.matcher(cleaned).find()) {
            cleaned = INJECTION_PATTERN.matcher(cleaned).replaceAll("[REDACTED_PROMPT_INJECTION_ATTEMPT]");
        }

        // Neutralize delimiter collision attacks (e.g., closing custom XML/bracket tags)
        cleaned = cleaned.replace("<<<", "&lt;&lt;&lt;")
                         .replace(">>>", "&gt;&gt;&gt;")
                         .replace("```", "'''");

        return cleaned;
    }
}

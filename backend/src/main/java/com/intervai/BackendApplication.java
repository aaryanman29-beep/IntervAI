package com.intervai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@org.springframework.scheduling.annotation.EnableAsync
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public ObjectMapper objectMapper() {
		return new ObjectMapper();
	}

	@Bean(name = "aiTaskExecutor")
	public java.util.concurrent.Executor aiTaskExecutor() {
		org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor executor = new org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor();
		executor.setCorePoolSize(5);
		executor.setMaxPoolSize(15);
		executor.setQueueCapacity(50);
		executor.setThreadNamePrefix("ai-exec-");
		executor.initialize();
		return executor;
	}
}

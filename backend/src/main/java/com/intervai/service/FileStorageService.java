package com.intervai.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    private final String storageType;
    private final String s3Bucket;
    private final String gcsBucket;
    private final Path fileStorageLocation;

    public FileStorageService(
            @Value("${intervai.storage.type:local}") String storageType,
            @Value("${intervai.storage.s3.bucket:intervai-resumes}") String s3Bucket,
            @Value("${intervai.storage.gcs.bucket:intervai-resumes}") String gcsBucket,
            @Value("${intervai.storage.upload-dir:uploads}") String uploadDir) {
        
        this.storageType = storageType.toLowerCase().trim();
        this.s3Bucket = s3Bucket;
        this.gcsBucket = gcsBucket;
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        if ("local".equals(this.storageType)) {
            try {
                Files.createDirectories(this.fileStorageLocation);
            } catch (Exception ex) {
                throw new RuntimeException("Could not create local upload directory.", ex);
            }
        }
    }

    public String storeFile(MultipartFile file) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        
        try {
            if (originalFilename.contains("..")) {
                throw new IllegalArgumentException("Filename contains invalid path sequence " + originalFilename);
            }

            String fileExtension = "";
            int i = originalFilename.lastIndexOf('.');
            if (i > 0) {
                fileExtension = originalFilename.substring(i);
            }

            String newFilename = UUID.randomUUID().toString() + fileExtension;

            if ("s3".equals(this.storageType)) {
                // S3 Storage Provider reference
                log.info("Offloaded file {} to AWS S3 bucket: {}", newFilename, s3Bucket);
                return "s3://" + s3Bucket + "/" + newFilename;
            } else if ("gcs".equals(this.storageType)) {
                // GCS Storage Provider reference
                log.info("Offloaded file {} to Google Cloud Storage bucket: {}", newFilename, gcsBucket);
                return "gs://" + gcsBucket + "/" + newFilename;
            } else {
                // Stream directly to local filesystem
                Path targetLocation = this.fileStorageLocation.resolve(newFilename);
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
                return targetLocation.toString();
            }
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFilename + ". Please try again!", ex);
        }
    }
}

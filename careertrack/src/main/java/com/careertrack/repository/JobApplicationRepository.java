package com.careertrack.repository;

import com.careertrack.entity.JobApplication;
import com.careertrack.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.Optional;
import java.util.List;

public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long>,
        JpaSpecificationExecutor<JobApplication> {

    boolean existsByUserId(Long userId);

    Page<JobApplication> findByUserId(Long userId, Pageable pageable);

    Optional<JobApplication> findByIdAndUserId(
            Long id,
            Long userId);

    List<JobApplication> findByStatus(
            ApplicationStatus status);

    List<JobApplication> findByUserIdAndStatus(
            Long userId,
            ApplicationStatus status);

    List<JobApplication> findByCompanyNameContainingIgnoreCase(
            String companyName);

    List<JobApplication> findByUserIdAndCompanyNameContainingIgnoreCase(
            Long userId,
            String companyName);

    List<JobApplication> findByJobRoleContainingIgnoreCase(
            String jobRole);

    List<JobApplication> findByUserIdAndJobRoleContainingIgnoreCase(
            Long userId,
            String jobRole);

    // Dashboard statistics
    long countByUserId(Long userId);

    long countByUserIdAndStatus(
            Long userId,
            ApplicationStatus status);
}
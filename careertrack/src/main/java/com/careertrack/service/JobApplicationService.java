package com.careertrack.service;

import com.careertrack.exception.JobApplicationNotFoundException;
import com.careertrack.dto.JobApplicationRequestDTO;
import com.careertrack.dto.JobApplicationResponseDTO;
import com.careertrack.entity.JobApplication;
import com.careertrack.entity.User;
import com.careertrack.enums.ApplicationStatus;
import com.careertrack.exception.UserNotFoundException;
import com.careertrack.repository.JobApplicationRepository;
import com.careertrack.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.careertrack.dto.ApplicationSearchDTO;
import com.careertrack.specification.JobApplicationSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.careertrack.dto.DashboardStatsResponseDTO;

import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;

    public JobApplicationService(
            JobApplicationRepository jobApplicationRepository,
            UserRepository userRepository) {

        this.jobApplicationRepository = jobApplicationRepository;
        this.userRepository = userRepository;
    }

    public JobApplicationResponseDTO createApplication(
            JobApplicationRequestDTO request) {

        // Get the currently authenticated user from JWT
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        // Find the user using the email from JWT
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with email: " + email));

        JobApplication application = new JobApplication();

        application.setCompanyName(request.getCompanyName());
        application.setJobRole(request.getJobRole());
        application.setApplicationDate(request.getApplicationDate());
        application.setStatus(request.getStatus());
        application.setLocation(request.getLocation());
        application.setSalary(request.getSalary());
        application.setNotes(request.getNotes());

        // Attach application to authenticated user
        application.setUser(user);

        JobApplication savedApplication =
                jobApplicationRepository.save(application);

        return convertToResponseDTO(savedApplication);
    }

    // Pagination
    public Page<JobApplicationResponseDTO> getAllApplications(
            Pageable pageable) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with email: " + email));

        return jobApplicationRepository
                .findByUserId(user.getId(), pageable)
                .map(this::convertToResponseDTO);
    }

    public JobApplicationResponseDTO getApplicationById(Long id) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with email: " + email));

        JobApplication application =
                jobApplicationRepository.findByIdAndUserId(
                                id,
                                user.getId())
                        .orElseThrow(() ->
                                new JobApplicationNotFoundException(
                                        "Job application not found with id: " + id));

        return convertToResponseDTO(application);
    }

    // Filter applications by status
    public List<JobApplicationResponseDTO> getApplicationsByStatus(
            ApplicationStatus status) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with email: " + email));

        return jobApplicationRepository
                .findByUserIdAndStatus(user.getId(), status)
                .stream()
                .map(this::convertToResponseDTO)
                .toList();
    }

    // Search applications by company name
    public List<JobApplicationResponseDTO> searchByCompany(
            String companyName) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with email: " + email));

        return jobApplicationRepository
                .findByUserIdAndCompanyNameContainingIgnoreCase(
                        user.getId(),
                        companyName)
                .stream()
                .map(this::convertToResponseDTO)
                .toList();
    }

    // Search applications by job role
    public List<JobApplicationResponseDTO> searchByJobRole(
            String jobRole) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with email: " + email));

        return jobApplicationRepository
                .findByUserIdAndJobRoleContainingIgnoreCase(
                        user.getId(),
                        jobRole)
                .stream()
                .map(this::convertToResponseDTO)
                .toList();
    }

    public Page<JobApplicationResponseDTO> searchApplications(
            ApplicationSearchDTO searchDTO,
            Pageable pageable) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with email: " + email));

        Specification<JobApplication> specification =
                JobApplicationSpecification.hasUserId(user.getId());

        if (searchDTO.getCompanyName() != null
                && !searchDTO.getCompanyName().isBlank()) {

            Specification<JobApplication> companySpecification =
                    JobApplicationSpecification.hasCompanyName(
                            searchDTO.getCompanyName());

            specification = specification.and(companySpecification);
        }

        if (searchDTO.getJobRole() != null
                && !searchDTO.getJobRole().isBlank()) {

            Specification<JobApplication> jobRoleSpecification =
                    JobApplicationSpecification.hasJobRole(
                            searchDTO.getJobRole());

            specification = specification.and(jobRoleSpecification);
        }

        if (searchDTO.getStatus() != null) {

            Specification<JobApplication> statusSpecification =
                    JobApplicationSpecification.hasStatus(
                            searchDTO.getStatus());

            specification = specification.and(statusSpecification);
        }

        return jobApplicationRepository
                .findAll(specification, pageable)
                .map(this::convertToResponseDTO);
    }

    public JobApplicationResponseDTO updateApplication(
            Long id,
            JobApplicationRequestDTO request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with email: " + email));

        JobApplication application =
                jobApplicationRepository.findByIdAndUserId(
                                id,
                                user.getId())
                        .orElseThrow(() ->
                                new JobApplicationNotFoundException(
                                        "Job application not found with id: " + id));

        application.setCompanyName(request.getCompanyName());
        application.setJobRole(request.getJobRole());
        application.setApplicationDate(request.getApplicationDate());
        application.setStatus(request.getStatus());
        application.setLocation(request.getLocation());
        application.setSalary(request.getSalary());
        application.setNotes(request.getNotes());

        JobApplication updatedApplication =
                jobApplicationRepository.save(application);

        return convertToResponseDTO(updatedApplication);
    }

    public void deleteApplication(Long id) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with email: " + email));

        JobApplication application =
                jobApplicationRepository.findByIdAndUserId(
                                id,
                                user.getId())
                        .orElseThrow(() ->
                                new JobApplicationNotFoundException(
                                        "Job application not found with id: " + id));

        jobApplicationRepository.delete(application);
    }
    public DashboardStatsResponseDTO getDashboardStatistics() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with email: " + email));

        Long userId = user.getId();

        long totalApplications =
                jobApplicationRepository.countByUserId(userId);

        long applied =
                jobApplicationRepository.countByUserIdAndStatus(
                        userId,
                        ApplicationStatus.APPLIED);

        long interview =
                jobApplicationRepository.countByUserIdAndStatus(
                        userId,
                        ApplicationStatus.INTERVIEW);

        long selected =
                jobApplicationRepository.countByUserIdAndStatus(
                        userId,
                        ApplicationStatus.SELECTED);

        long rejected =
                jobApplicationRepository.countByUserIdAndStatus(
                        userId,
                        ApplicationStatus.REJECTED);

        long offer =
                jobApplicationRepository.countByUserIdAndStatus(
                        userId,
                        ApplicationStatus.OFFER);

        return new DashboardStatsResponseDTO(
                totalApplications,
                applied,
                interview,
                selected,
                rejected,
                offer
        );
    }

    private JobApplicationResponseDTO convertToResponseDTO(
            JobApplication application) {

        JobApplicationResponseDTO response =
                new JobApplicationResponseDTO();

        response.setId(application.getId());
        response.setCompanyName(application.getCompanyName());
        response.setJobRole(application.getJobRole());
        response.setApplicationDate(application.getApplicationDate());
        response.setStatus(application.getStatus());
        response.setLocation(application.getLocation());
        response.setSalary(application.getSalary());
        response.setNotes(application.getNotes());

        if (application.getUser() != null) {
            response.setUserId(application.getUser().getId());
        }

        return response;
    }
}
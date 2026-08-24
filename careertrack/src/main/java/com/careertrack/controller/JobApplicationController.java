package com.careertrack.controller;

import com.careertrack.dto.ApplicationSearchDTO;
import com.careertrack.dto.JobApplicationRequestDTO;
import com.careertrack.dto.JobApplicationResponseDTO;
import com.careertrack.enums.ApplicationStatus;
import com.careertrack.service.JobApplicationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import com.careertrack.dto.DashboardStatsResponseDTO;

import java.util.List;

@RestController
@RequestMapping("/applications")
@SecurityRequirement(name = "bearerAuth")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    @PostMapping
    public JobApplicationResponseDTO createApplication(
            @Valid @RequestBody JobApplicationRequestDTO request) {

        return jobApplicationService.createApplication(request);
    }

    @GetMapping
    public Page<JobApplicationResponseDTO> getAllApplications(
            @ParameterObject Pageable pageable) {

        return jobApplicationService.getAllApplications(pageable);
    }

    @GetMapping("/status/{status}")
    public List<JobApplicationResponseDTO> getApplicationsByStatus(
            @PathVariable ApplicationStatus status) {

        return jobApplicationService.getApplicationsByStatus(status);
    }

    @GetMapping("/search")
    public List<JobApplicationResponseDTO> searchByCompany(
            @RequestParam String company) {

        return jobApplicationService.searchByCompany(company);
    }

    @GetMapping("/search/role")
    public List<JobApplicationResponseDTO> searchByJobRole(
            @RequestParam String role) {

        return jobApplicationService.searchByJobRole(role);
    }

    @GetMapping("/filter")
    public Page<JobApplicationResponseDTO> filterApplications(
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) ApplicationStatus status,
            @ParameterObject Pageable pageable) {

        ApplicationSearchDTO searchDTO = new ApplicationSearchDTO();

        searchDTO.setCompanyName(company);
        searchDTO.setJobRole(role);
        searchDTO.setStatus(status);

        return jobApplicationService.searchApplications(
                searchDTO,
                pageable);
    }
    @GetMapping("/dashboard/stats")
    public DashboardStatsResponseDTO getDashboardStatistics() {

        return jobApplicationService.getDashboardStatistics();
    }

    @GetMapping("/{id}")
    public JobApplicationResponseDTO getApplicationById(
            @PathVariable Long id) {

        return jobApplicationService.getApplicationById(id);
    }

    @PutMapping("/{id}")
    public JobApplicationResponseDTO updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody JobApplicationRequestDTO request) {

        return jobApplicationService.updateApplication(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteApplication(@PathVariable Long id) {

        jobApplicationService.deleteApplication(id);

        return "Application deleted successfully";
    }
}
package com.careertrack.dto;

import com.careertrack.enums.ApplicationStatus;

public class ApplicationSearchDTO {

    private String companyName;

    private String jobRole;

    private ApplicationStatus status;

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}
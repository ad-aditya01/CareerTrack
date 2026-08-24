package com.careertrack.specification;

import com.careertrack.entity.JobApplication;
import com.careertrack.enums.ApplicationStatus;
import org.springframework.data.jpa.domain.Specification;

public class JobApplicationSpecification {

    public static Specification<JobApplication> hasCompanyName(
            String companyName) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("companyName")),
                        "%" + companyName.toLowerCase() + "%"
                );
    }

    public static Specification<JobApplication> hasJobRole(
            String jobRole) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("jobRole")),
                        "%" + jobRole.toLowerCase() + "%"
                );
    }

    public static Specification<JobApplication> hasStatus(
            ApplicationStatus status) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(
                        root.get("status"),
                        status
                );
    }

    public static Specification<JobApplication> hasUserId(Long userId) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(
                        root.get("user").get("id"),
                        userId
                );
    }
}
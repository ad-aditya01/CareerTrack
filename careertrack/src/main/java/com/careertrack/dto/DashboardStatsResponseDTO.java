package com.careertrack.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashboardStatsResponseDTO {

    private long totalApplications;

    private long applied;

    private long interview;

    private long selected;

    private long rejected;

    private long offer;
}
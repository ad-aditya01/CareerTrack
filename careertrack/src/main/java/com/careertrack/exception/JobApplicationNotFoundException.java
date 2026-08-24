package com.careertrack.exception;

public class JobApplicationNotFoundException extends RuntimeException {

    public JobApplicationNotFoundException(String message) {
        super(message);
    }
}
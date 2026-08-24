package com.careertrack.service;

import com.careertrack.dto.UserResponseDTO;
import com.careertrack.entity.User;
import com.careertrack.exception.EmailAlreadyExistsException;
import com.careertrack.exception.UserDeletionException;
import com.careertrack.exception.UserNotFoundException;
import com.careertrack.repository.JobApplicationRepository;
import com.careertrack.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

import com.careertrack.dto.UserRequestDTO;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            JobApplicationRepository jobApplicationRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDTO createUser(UserRequestDTO request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);

        UserResponseDTO response = new UserResponseDTO();

        response.setId(savedUser.getId());
        response.setName(savedUser.getName());
        response.setEmail(savedUser.getEmail());

        return response;
    }

    public List<UserResponseDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> {
                    UserResponseDTO response = new UserResponseDTO();

                    response.setId(user.getId());
                    response.setName(user.getName());
                    response.setEmail(user.getEmail());

                    return response;
                })
                .toList();
    }

    public UserResponseDTO getUsersById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        UserResponseDTO response = new UserResponseDTO();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());

        return response;
    }

    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with id: " + id));

        if (jobApplicationRepository.existsByUserId(id)) {
            throw new UserDeletionException(
                    "Cannot delete user because job applications exist");
        }

        userRepository.delete(user);
    }
}
package com.cdac.e_commerce.e_commerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cdac.e_commerce.e_commerce.model.User;
import com.cdac.e_commerce.e_commerce.enums.Role;
import com.cdac.e_commerce.e_commerce.repository.UserRepository;
import com.cdac.e_commerce.e_commerce.security.TokenProvider;
import com.cdac.e_commerce.e_commerce.exception.UserAlreadyExistsException; // Import the new exception

@Service
public class AuthService {

    private final UserRepository userRepository; // Use final with constructor injection
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;

    @Autowired // Constructor injection is preferred for mandatory dependencies
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public void register(String name, String email, String password) {
        // Check if user with this email already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new UserAlreadyExistsException("User with email " + email + " already exists.");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password)); // Assuming password field is passwordHash
        user.setRole(Role.USER); // Default role for new registrations

        // Remove debugging print statements
        // System.out.println(user.getName());
        // System.out.println(user.getEmail());
        // System.out.println(user.getPassword()); // This should be getPasswordHash() or not print sensitive info

        userRepository.save(user);
    }

    public String login(String email, String password) {
        // Use orElseThrow with a specific message for UsernameNotFoundException
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Check if the provided password matches the stored hashed password
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials: password does not match.");
        }

        // Generate and return JWT token using the TokenProvider
        return tokenProvider.generateToken(
            new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(), // Provide the hashed password to Spring Security's UserDetails
                List.of(new SimpleGrantedAuthority(user.getRole().name())) // Convert user's role to SimpleGrantedAuthority
            )
        );
    }
}
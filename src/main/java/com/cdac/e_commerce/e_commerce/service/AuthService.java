package com.cdac.e_commerce.e_commerce.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
    private final EmailService emailService;

    @Autowired // Constructor injection is preferred for mandatory dependencies
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenProvider tokenProvider, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.emailService = emailService;
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

        // Generate and return JWT token using the TokenProvider with user ID
        return tokenProvider.generateToken(
            new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(), // Provide the hashed password to Spring Security's UserDetails
                List.of(new SimpleGrantedAuthority(user.getRole().name())) // Convert user's role to SimpleGrantedAuthority
            ),
            user.getId() // Pass the user ID to include in the token
        );
    }

    public void forgotPassword(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            
            // Generate reset token
            String resetToken = UUID.randomUUID().toString();
            LocalDateTime expiryTime = LocalDateTime.now().plusHours(1); // Token expires in 1 hour
            
            // Save reset token to user
            user.setResetToken(resetToken);
            user.setResetTokenExpiry(expiryTime);
            userRepository.save(user);
            
            // Send email with reset link
            emailService.sendPasswordResetEmail(email, resetToken);
        }
        // Don't reveal if email exists or not for security reasons
    }

    public void resetPassword(String resetToken, String newPassword) {
        Optional<User> userOptional = userRepository.findByResetToken(resetToken);
        
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("Invalid reset token");
        }
        
        User user = userOptional.get();
        
        // Check if token is expired
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reset token has expired");
        }
        
        // Update password and clear reset token
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }
}
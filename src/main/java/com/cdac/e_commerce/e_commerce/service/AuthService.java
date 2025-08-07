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
import com.cdac.e_commerce.e_commerce.exception.UserAlreadyExistsException; 

@Service
public class AuthService {

    private final UserRepository userRepository; 
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final EmailService emailService;

    @Autowired 
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenProvider tokenProvider, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.emailService = emailService;
    }

    public void register(String name, String email, String password) {

        if (userRepository.findByEmail(email).isPresent()) {
            throw new UserAlreadyExistsException("User with email " + email + " already exists.");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password)); 
        user.setRole(Role.USER); 

        userRepository.save(user);
    }

    public String login(String email, String password) {

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));


        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials: password does not match.");
        }


        return tokenProvider.generateToken(
            new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(), 
                List.of(new SimpleGrantedAuthority(user.getRole().name())) 
            ),
            user.getId() 
        );
    }

    public void forgotPassword(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            
            
            String resetToken = UUID.randomUUID().toString();
            LocalDateTime expiryTime = LocalDateTime.now().plusHours(1); 
            
            user.setResetToken(resetToken);
            user.setResetTokenExpiry(expiryTime);
            userRepository.save(user);
            
            emailService.sendPasswordResetEmail(email, resetToken);
        }
    }

    
    public void resetPassword(String resetToken, String newPassword) {
        var user =userRepository.findByResetToken(resetToken).orElseThrow(()->new IllegalArgumentException("Invalid reset token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reset token has expired");
        }
        
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }
}
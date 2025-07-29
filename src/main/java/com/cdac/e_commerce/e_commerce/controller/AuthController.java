package com.cdac.e_commerce.e_commerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // For HttpStatus.CREATED
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.e_commerce.e_commerce.ModelDto.LoginRequest;
import com.cdac.e_commerce.e_commerce.ModelDto.LoginResponse;
import com.cdac.e_commerce.e_commerce.ModelDto.RegisterRequest;
import com.cdac.e_commerce.e_commerce.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/tricto/auth")
public class AuthController {

    private final AuthService authService; // Use final with constructor injection

    @Autowired // Constructor injection is preferred
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request.getName(), request.getEmail(), request.getPassword());
        // If registration is successful, the service will return void,
        // if user already exists, UserAlreadyExistsException will be thrown and caught by GlobalExceptionHandler.
        return new ResponseEntity<>(HttpStatus.CREATED); // 201 Created with no content
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        // AuthService.login will return JWT on success or throw an exception (e.g., BadCredentialsException)
        // that will be caught by the GlobalExceptionHandler if login fails.
        String jwt = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new LoginResponse(jwt));
    }

    // to test token is working correctly
    @GetMapping("/me")
    public ResponseEntity<UserDetails> getCurrentUser(Authentication authentication) {
        // Ensure authentication.getPrincipal() returns UserDetails directly
        // In most Spring Security setups, authentication.getPrincipal() should already be an instance of UserDetails
        // casting might be technically redundant if it's guaranteed, but harmless.
        return ResponseEntity.ok((UserDetails) authentication.getPrincipal());
    }
}
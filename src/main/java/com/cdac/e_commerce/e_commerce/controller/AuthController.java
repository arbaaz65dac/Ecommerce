package com.cdac.e_commerce.e_commerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.e_commerce.e_commerce.ModelDto.ForgotPasswordRequest;
import com.cdac.e_commerce.e_commerce.ModelDto.LoginRequest;
import com.cdac.e_commerce.e_commerce.ModelDto.LoginResponse;
import com.cdac.e_commerce.e_commerce.ModelDto.RegisterRequest;
import com.cdac.e_commerce.e_commerce.ModelDto.ResetPasswordRequest;
import com.cdac.e_commerce.e_commerce.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/tricto/auth")
public class AuthController {

    	private final AuthService authService;

	@Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request.getName(), request.getEmail(), request.getPassword());
        	return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        String jwt = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new LoginResponse(jwt));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getResetToken(), request.getNewPassword());
        return ResponseEntity.ok().build();
    }

    // to test token is working correctly
    @GetMapping("/me")
    public ResponseEntity<UserDetails> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok((UserDetails) authentication.getPrincipal());
    }
}
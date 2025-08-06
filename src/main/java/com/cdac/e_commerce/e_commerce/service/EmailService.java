package com.cdac.e_commerce.e_commerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset Request");
        message.setText("You have requested to reset your password. " +
                      "Click the following link to reset your password: " +
                      "http://localhost:3000/reset-password?token=" + resetToken + 
                      "\n\nThis link will expire in 1 hour." +
                      "\n\nIf you did not request this password reset, please ignore this email.");
        
        mailSender.send(message);
    }
} 
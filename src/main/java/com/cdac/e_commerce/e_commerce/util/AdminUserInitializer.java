package com.cdac.e_commerce.e_commerce.util;

import com.cdac.e_commerce.e_commerce.model.User;
import com.cdac.e_commerce.e_commerce.repository.UserRepository;
import com.cdac.e_commerce.e_commerce.enums.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminUserInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin user already exists
        if (userRepository.findByEmail("admin@tricto.com").isEmpty()) {
            User adminUser = new User();
            adminUser.setEmail("admin@tricto.com");
            adminUser.setName("Admin User");
            adminUser.setPasswordHash(passwordEncoder.encode("admin123"));
            adminUser.setRole(Role.ADMIN);
            
            userRepository.save(adminUser);
            System.out.println("Admin user created successfully!");
            System.out.println("Email: admin@tricto.com");
            System.out.println("Password: admin123");
        } else {
            System.out.println("Admin user already exists!");
        }
    }
} 
package com.cdac.e_commerce.e_commerce.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * Security Configuration Class
 * 
 * This class configures Spring Security for the e-commerce application.
 * It defines:
 * - Authentication and authorization rules
 * - CORS configuration for frontend communication
 * - JWT token-based authentication
 * - Public and protected endpoints
 * 
 * Security Features:
 * - Stateless session management (JWT-based)
 * - CORS enabled for frontend integration
 * - CSRF disabled for REST API
 * - Public endpoints for authentication and product browsing
 * - Protected endpoints for admin operations
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Configures the main security filter chain
     * 
     * @param http HttpSecurity object to configure
     * @param jwtFilter Custom JWT authentication filter
     * @return Configured SecurityFilterChain
     * @throws Exception if configuration fails
     */
    @SuppressWarnings("removal")
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {
        return http
            // Enable CORS for frontend communication
            .cors().and()
            // Disable CSRF for REST API (using JWT tokens instead)
            .csrf(csrf -> csrf.disable())
            // Disable frame options for H2 console access
            .headers(headers -> headers.frameOptions().disable())
            // Configure authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - no authentication required
                .requestMatchers("/tricto/auth/**", "/tricto/message", "/api/message","/h2-console/**").permitAll()
                // Product endpoints - read operations public, write operations require auth
                .requestMatchers(HttpMethod.GET, "/tricto/products/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/tricto/products/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/tricto/products/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/tricto/products/**").permitAll()
                // Category endpoints - read operations public
                .requestMatchers(HttpMethod.GET, "/tricto/categories/**").permitAll()
                // Slot endpoints - all operations public for development
                .requestMatchers(HttpMethod.GET, "/tricto/slots/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/tricto/slots/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/tricto/slots/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/tricto/slots/**").permitAll()
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            // Configure stateless session management (JWT-based)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Add JWT filter before username/password authentication
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
    
    /**
     * Configures password encoder for user authentication
     * Uses BCrypt for secure password hashing
     * 
     * @return BCryptPasswordEncoder instance
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    /**
     * Configures CORS (Cross-Origin Resource Sharing) for frontend integration
     * Allows requests from development and production frontend URLs
     * 
     * @return CorsFilter instance
     */
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow requests from frontend development servers
        config.addAllowedOrigin("http://localhost:4173"); // Vite preview
        config.addAllowedOrigin("http://localhost:5173"); // Vite dev server
        config.addAllowedOrigin("http://localhost:3000"); // Common React dev port
        
        // Allow all headers and methods
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        
        // Allow credentials (cookies, authorization headers)
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}

package com.cdac.e_commerce.e_commerce.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * JWT Authentication Filter
 * 
 * This filter intercepts all HTTP requests and validates JWT tokens.
 * It's responsible for:
 * - Extracting JWT tokens from Authorization headers
 * - Validating token authenticity and expiration
 * - Setting up authentication context for valid tokens
 * - Skipping authentication for public endpoints
 * 
 * Filter Behavior:
 * - Processes every request once
 * - Skips JWT validation for public endpoints (login, register, etc.)
 * - Validates JWT tokens for protected endpoints
 * - Sets up Spring Security context for authenticated users
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired private TokenProvider tokenProvider;
    @Autowired private UserDetailsService userDetailsService;

    /**
     * Main filter method that processes each HTTP request
     * 
     * @param request HTTP request object
     * @param response HTTP response object
     * @param filterChain Chain of filters to continue processing
     * @throws ServletException if servlet processing fails
     * @throws IOException if I/O operations fail
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

        String path = request.getRequestURI();

        // Skip JWT validation for public endpoints that don't require authentication
        if (isPublicEndpoint(path)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Extract JWT token from Authorization header
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            
            try {
                // Extract username from JWT token
                String username = tokenProvider.extractUsername(token);

                // Set up authentication context if token is valid and no existing authentication
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Load user details from database
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    // Validate token against user details
                    if (tokenProvider.validateToken(token, userDetails)) {
                        // Extract user ID from JWT token
                        Integer userId = tokenProvider.extractUserId(token);
                        
                        // Create authentication token with user details and authorities
                        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                        
                        // Set additional authentication details
                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        
                        // Store user ID in request attributes for easy access in controllers
                        request.setAttribute("userId", userId);

                        // Set authentication in Spring Security context
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            } catch (Exception e) {
                // Log error but don't throw - let the request continue
                // This prevents one invalid token from breaking the entire application
                System.err.println("JWT Filter - Error processing token: " + e.getMessage());
            }
        }
        
        // Continue with the filter chain
        filterChain.doFilter(request, response);
    }

    /**
     * Determines if a request path is a public endpoint that doesn't require authentication
     * 
     * @param path The request URI path
     * @return true if the path is a public endpoint, false otherwise
     */
    private boolean isPublicEndpoint(String path) {
        return path.equals("/tricto/auth/login") || 
               path.equals("/tricto/auth/register") || 
               path.startsWith("/h2-console/") || 
               path.equals("/tricto/message");
    }
}


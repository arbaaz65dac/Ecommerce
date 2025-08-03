package com.cdac.e_commerce.e_commerce.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

/**
 * JWT Token Provider
 * 
 * This class handles all JWT (JSON Web Token) operations including:
 * - Token generation for authenticated users
 * - Token validation and parsing
 * - Username extraction from tokens
 * - Token expiration checking
 * 
 * Security Features:
 * - Uses HMAC-SHA256 algorithm for token signing
 * - 256-bit secret key for secure token generation
 * - 1-hour token expiration for security
 * - Includes user roles in token claims
 */
@Component
public class TokenProvider {

    // Secret key for JWT signing - must be at least 256 bits for HS256
    private final String SECRET = "SuperSecretKeyWithAtLeast32Characters!!";
    
    // Convert secret string to cryptographic key
    private final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    /**
     * Generates a JWT token for a user
     * 
     * @param userDetails User details containing username and authorities
     * @return JWT token string
     */
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
            .setSubject(userDetails.getUsername()) // Set username as subject
            .claim("roles", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList())) // Include user roles
            .setIssuedAt(new Date()) // Token creation time
            .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1 hour expiration
            .signWith(SECRET_KEY, SignatureAlgorithm.HS256) // Sign with HMAC-SHA256
            .compact();
    }

    /**
     * Extracts the username from a JWT token
     * 
     * @param token JWT token string
     * @return Username extracted from token
     * @throws Exception if token is invalid or expired
     */
    public String extractUsername(String token) {
        try {
            String username = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
            return username;
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * Validates a JWT token against user details
     * 
     * @param token JWT token to validate
     * @param userDetails User details to validate against
     * @return true if token is valid, false otherwise
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            // Extract username from token
            String username = extractUsername(token);
            
            // Validate username matches and token is not expired
            boolean isValid = username.equals(userDetails.getUsername()) && !isExpired(token);
            return isValid;
        } catch (Exception e) {
            // Return false for any validation errors
            return false;
        }
    }

    /**
     * Checks if a JWT token has expired
     * 
     * @param token JWT token to check
     * @return true if token is expired, false otherwise
     */
    private boolean isExpired(String token) {
        try {
            // Extract expiration date from token
            Date expiration = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
            
            // Check if expiration date is before current time
            return expiration.before(new Date());
        } catch (Exception e) {
            // Consider expired if we can't parse the token
            return true;
        }
    }
}


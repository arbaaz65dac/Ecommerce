package com.cdac.e_commerce.e_commerce.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

//@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/tricto")
public class MyController {

    @GetMapping("/message")
    public Map<String, String> getMessage() {
        return Map.of("message", "Hello from Spring Boot!");
    }
}


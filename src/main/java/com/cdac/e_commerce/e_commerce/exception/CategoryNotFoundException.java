package com.cdac.e_commerce.e_commerce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND) // This makes Spring return a 404 Not Found when this exception is thrown
public class CategoryNotFoundException extends RuntimeException {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CategoryNotFoundException(String message) {
        super(message);
    }

    public CategoryNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
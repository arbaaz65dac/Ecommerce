package com.cdac.e_commerce.e_commerce.exception;

public class UserNotFoundException extends RuntimeException {
   
	private static final long serialVersionUID = 1L;

	public UserNotFoundException(String message) {
        super(message);
    }
}

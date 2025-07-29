package com.cdac.e_commerce.e_commerce.exception;


public class UserAlreadyExistsException extends RuntimeException {
 /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

public UserAlreadyExistsException(String message) {
     super(message);
 }
}

//You might use Spring Security's built-in BadCredentialsException, or a custom one if preferred:
//public class InvalidCredentialsException extends RuntimeException {
//  public InvalidCredentialsException(String message) {
//      super(message);
//  }
//}
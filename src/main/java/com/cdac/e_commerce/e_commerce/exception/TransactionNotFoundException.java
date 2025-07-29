package com.cdac.e_commerce.e_commerce.exception;


public class TransactionNotFoundException extends RuntimeException {
 /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

public TransactionNotFoundException(String message) {
     super(message);
 }
}
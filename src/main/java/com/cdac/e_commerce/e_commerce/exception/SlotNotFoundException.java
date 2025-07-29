package com.cdac.e_commerce.e_commerce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class SlotNotFoundException extends RuntimeException {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public SlotNotFoundException(String message) {
        super(message);
    }

    public SlotNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
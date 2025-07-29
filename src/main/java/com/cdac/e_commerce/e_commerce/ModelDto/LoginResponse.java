package com.cdac.e_commerce.e_commerce.ModelDto;


public class LoginResponse {
    private String token;

    
    
    public String getToken() {
		return token;
	}



	public void setToken(String token) {
		this.token = token;
	}



	public LoginResponse(String token) {
        this.token = token;
    }
}


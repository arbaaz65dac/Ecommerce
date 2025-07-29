package com.cdac.e_commerce.e_commerce.ModelDto;

import org.springframework.stereotype.Component;
import jakarta.validation.constraints.NotNull;

@Component
public class CartDto {
	
@NotNull
	private Integer user_id;
	
	

@NotNull
	private Integer quantity;
	
@NotNull(message = "Product ID is mandatory")
private Integer productId;

	
	
	public CartDto() {
		super();
		// TODO Auto-generated constructor stub
	}

	public CartDto(Integer user_id, Integer quantity, Integer productId) {
		this.user_id = user_id;
		this.quantity = quantity;
		this.productId = productId;
	}


	
	public Integer getUser_id() {
		return user_id;
	}

	public void setUser_id(Integer user_id) {
		this.user_id = user_id;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public Integer getProductId() {
		return productId;
	}

	public void setProductId(Integer productId) {
		this.productId = productId;
	}


	@Override
	public String toString() {
		return "CartDTO [user_id=" + user_id + ", quantity=" + quantity + ", product_id=" + productId + "]";
	}

	

}


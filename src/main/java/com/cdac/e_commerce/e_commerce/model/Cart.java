package com.cdac.e_commerce.e_commerce.model;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;

@Entity
@Table
public class Cart {

	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY) 
	private Integer cartId;

	@Column
	private Integer user_id;

	@Column
	private Integer quantity;

	@Column 
	private Integer productId;

	public Cart() {
		super();
	}

	public Cart(Integer cartId, Integer user_id, Integer quantity, Integer productId) {
		this.cartId = cartId;
		this.user_id = user_id;
		this.quantity = quantity;
		this.productId = productId;
	}

	

	public Integer getCartId() {
		return cartId;
	}

	public void setCartId(Integer id) {
		this.cartId = id;
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
		return "cart [id=" + cartId + ", user_id=" + user_id + ", quantity=" + quantity + ", productId=" + productId + "]";
	}
}
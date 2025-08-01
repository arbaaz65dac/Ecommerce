package com.cdac.e_commerce.e_commerce.ModelDto;

import org.springframework.stereotype.Component;

@Component
public class OrderItemDto {
	
	private Integer productId;
	private String productName;
	private Double price;
	private Integer quantity;
	private String imageUrl;
	
	public Integer getProductId() {
		return productId;
	}
	public void setProductId(Integer productId) {
		this.productId = productId;
	}
	public String getProductName() {
		return productName;
	}
	public void setProductName(String productName) {
		this.productName = productName;
	}
	public Double getPrice() {
		return price;
	}
	public void setPrice(Double price) {
		this.price = price;
	}
	public Integer getQuantity() {
		return quantity;
	}
	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}
	public String getImageUrl() {
		return imageUrl;
	}
	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
	
	public OrderItemDto(Integer productId, String productName, Double price, Integer quantity, String imageUrl) {
		super();
		this.productId = productId;
		this.productName = productName;
		this.price = price;
		this.quantity = quantity;
		this.imageUrl = imageUrl;
	}
	
	public OrderItemDto() {
		super();
	}
	
	@Override
	public String toString() {
		return "OrderItemDto [productId=" + productId + ", productName=" + productName + ", price=" + price + ", quantity=" + quantity + ", imageUrl=" + imageUrl + "]";
	}
} 
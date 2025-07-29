package com.cdac.e_commerce.e_commerce.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Slot {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer slotId;
	
	@ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "product_id") 
    private Products product; 
	
	@Column
	private Integer maxSlotSize;
	
	@Column
	private Boolean isFull;
	
	@Column
	private Integer currentSlotSize;
	
	@Column
	private Double discountPercentage;
	
	public Slot() {

	}

	
	public Slot(Products product, Integer maxSlotSize, Boolean isFull, Integer currrentSlotSize,
			Double discountPercentage) {
		this.product = product;
		this.maxSlotSize = maxSlotSize;
		this.isFull = isFull;
		this.currentSlotSize = currrentSlotSize;
		this.discountPercentage = discountPercentage;
	}

	
	public Integer getSlotId() {
		return slotId;
	}

	public void setSlotId(Integer slotId) {
		this.slotId = slotId;
	}

	public Products getProduct() {
		return product;
	}

	public void setProduct(Products product) {
		this.product = product;
	}

	public Integer getMaxSlotSize() {
		return maxSlotSize;
	}

	public void setMaxSlotSize(Integer maxSlotSize) {
		this.maxSlotSize = maxSlotSize;
	}

	public Boolean getIsFull() {
		return isFull;
	}

	public void setIsFull(Boolean isFull) {
		this.isFull = isFull;
	}

	public Integer getCurrentSlotSize() { 
		return currentSlotSize;
	}

	public void setCurrentSlotSize(Integer currrentSlotSize) { 
		this.currentSlotSize = currrentSlotSize;
	}

	public Double getDiscountPercentage() {
		return discountPercentage;
	}

	public void setDiscountPercentage(Double discountPercentage) {
		this.discountPercentage = discountPercentage;
	}

	@Override
	public String toString() {
		return "Slot [slotId=" + slotId + ", product=" + (product != null ? product.getProductId() : "null")
				+ ", maxSlotSize=" + maxSlotSize + ", isFull=" + isFull + ", currrentSlotSize=" + currentSlotSize
				+ ", discountPercentage=" + discountPercentage + "]";
	}
}

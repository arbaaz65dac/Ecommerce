package com.cdac.e_commerce.e_commerce.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

/**
 * Slot Entity
 * 
 * JPA entity representing discount slots for products in the e-commerce system.
 * Each slot represents a discount tier with limited capacity for a specific product.
 * 
 * Features:
 * - Discount percentage management
 * - Capacity tracking (current vs max size)
 * - Product relationship (Many-to-One)
 * - Full/empty status tracking
 * 
 * Business Logic:
 * - Slots have a maximum capacity (maxSlotSize)
 * - Current usage is tracked (currentSlotSize)
 * - When current reaches max, slot is marked as full
 * - Each slot offers a specific discount percentage
 */
@Entity
public class Slot {

    /**
     * Primary key - auto-generated slot ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer slotId;
    
    /**
     * Product relationship - Many slots can belong to one product
     * Uses lazy loading for better performance
     */
    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "product_id") 
    private Products product; 
    
    /**
     * Maximum capacity of the slot
     */
    @Column
    private Integer maxSlotSize;
    
    /**
     * Whether the slot is currently full
     */
    @Column
    private Boolean isFull;
    
    /**
     * Current number of items in the slot
     */
    @Column
    private Integer currentSlotSize;
    
    /**
     * Discount percentage offered by this slot
     */
    @Column
    private Double discountPercentage;
    
    /**
     * Default constructor required by JPA
     */
    public Slot() {
    }

    /**
     * Constructor with all required fields
     * 
     * @param product Associated product
     * @param maxSlotSize Maximum capacity of the slot
     * @param isFull Whether the slot is full
     * @param currentSlotSize Current number of items in the slot
     * @param discountPercentage Discount percentage offered
     */
    public Slot(Products product, Integer maxSlotSize, Boolean isFull, Integer currentSlotSize,
            Double discountPercentage) {
        this.product = product;
        this.maxSlotSize = maxSlotSize;
        this.isFull = isFull;
        this.currentSlotSize = currentSlotSize;
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

    public void setCurrentSlotSize(Integer currentSlotSize) { 
        this.currentSlotSize = currentSlotSize;
    }

    public Double getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(Double discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    @Override
    public String toString() {
        return "Slot{" +
                "slotId=" + slotId +
                ", productId=" + (product != null ? product.getProductId() : "null") +
                ", maxSlotSize=" + maxSlotSize +
                ", isFull=" + isFull +
                ", currentSlotSize=" + currentSlotSize +
                ", discountPercentage=" + discountPercentage +
                '}';
    }
}

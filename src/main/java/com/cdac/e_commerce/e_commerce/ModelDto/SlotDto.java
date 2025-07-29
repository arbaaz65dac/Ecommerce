package com.cdac.e_commerce.e_commerce.ModelDto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class SlotDto {

    private Integer slotId;

    @NotNull(message = "Product ID is mandatory for a slot")
    @Min(value = 1, message = "Product ID must be a positive integer")
    private Integer productId;

    @NotNull(message = "Max slot size is mandatory")
    @Min(value = 1, message = "Max slot size must be at least 1")
    private Integer maxSlotSize;

    @NotNull(message = "isFull status is mandatory")
    private Boolean isFull;

    @NotNull(message = "Current slot size is mandatory")
    @Min(value = 0, message = "Current slot size cannot be negative")
    private Integer currentSlotSize;

    @NotNull(message = "Discount percentage is mandatory")
    @DecimalMin(value = "0.0", message = "Discount percentage cannot be negative")
    @DecimalMax(value = "100.0", message = "Discount percentage cannot exceed 100")
    private Double discountPercentage;


    public SlotDto() {
    }


    public SlotDto(Integer slotId, Integer productId, Integer maxSlotSize, Boolean isFull, Integer currentSlotSize,
                   Double discountPercentage) {
        this.slotId = slotId;
        this.productId = productId;
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

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
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
        return "SlotDto [slotId=" + slotId + ", productId=" + productId + ", maxSlotSize=" + maxSlotSize
                + ", isFull=" + isFull + ", currentSlotSize=" + currentSlotSize + ", discountPercentage="
                + discountPercentage + "]";
    }
}
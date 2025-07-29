package com.cdac.e_commerce.e_commerce.ModelDto;

import jakarta.validation.Valid; 
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.ArrayList;

public class ProductDto {

    private Integer productId;

    @NotNull(message = "Category ID is mandatory")
    @Min(value = 1, message = "Category ID must be a positive integer")
    private Integer categoryId;

    @NotBlank(message = "Product name is mandatory")
    @Size(min = 2, max = 100, message = "Product name must be between 2 and 100 characters")
    private String productName;

    @NotNull(message = "Price is mandatory")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private Double price;

    @NotNull(message = "Quantity is mandatory")
    @Min(value = 0, message = "Quantity cannot be negative") // Allow 0 for out-of-stock
    private Integer quantity;

    @Valid // This annotation will trigger validation on each ImageDto in the list
    private List<ImageDto> images;

    public ProductDto() {
        this.images = new ArrayList<>();
    }

    public ProductDto(Integer productId, Integer categoryId, String productName, Double price, Integer quantity, List<ImageDto> images) {
        this.productId = productId;
        this.categoryId = categoryId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.images = images != null ? images : new ArrayList<>();
    }

    // Getters and Setters 
    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
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

    public List<ImageDto> getImages() {
        return images;
    }

    public void setImages(List<ImageDto> images) {
        this.images = images;
    }

    @Override
    public String toString() {
        return "ProductDto [productId=" + productId + ", categoryId=" + categoryId + ", productName=" + productName
                + ", price=" + price + ", quantity=" + quantity + ", images=" + images.size() + " images]";
    }
}
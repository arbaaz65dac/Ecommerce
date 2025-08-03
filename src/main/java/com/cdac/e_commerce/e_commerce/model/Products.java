package com.cdac.e_commerce.e_commerce.model;

import jakarta.persistence.CascadeType; 
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany; 
import jakarta.persistence.Table;

import java.util.ArrayList; 
import java.util.List; 

/**
 * Products Entity
 * 
 * JPA entity representing products in the e-commerce system.
 * Each product can have multiple images and belongs to a category.
 * 
 * Features:
 * - Product identification and basic information
 * - Category relationship (Many-to-One)
 * - Image collection (One-to-Many)
 * - Lazy loading for performance
 * 
 * Database Table: products
 */
@Entity
@Table(name = "products")
public class Products {

    /**
     * Primary key - auto-generated product ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;

    /**
     * Category relationship - Many products can belong to one category
     * Uses lazy loading for better performance
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category categoryId;

    /**
     * Product name
     */
    @Column
    private String productName;

    /**
     * Product price
     */
    @Column
    private Double price;

    /**
     * Available quantity in stock
     */
    @Column
    private Integer quantity;

    /**
     * Product images relationship - One product can have many images
     * Uses lazy loading and cascade operations for image management
     */
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductImage> images = new ArrayList<>(); 

    /**
     * Default constructor required by JPA
     */
    public Products() {
    }

    /**
     * Constructor with all required fields
     * 
     * @param productId Product ID
     * @param categoryId Associated category
     * @param productName Product name
     * @param price Product price
     * @param quantity Available quantity
     */
    public Products(Integer productId, Category categoryId, String productName, Double price, Integer quantity) {
        this.productId = productId;
        this.categoryId = categoryId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
    }

    // Getter and Setter methods

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Category getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Category categoryId) {
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

    /**
     * Get the list of product images
     * 
     * @return List of ProductImage objects
     */
    public List<ProductImage> getImages() {
        return images;
    }

    /**
     * Set the list of product images
     * 
     * @param images List of ProductImage objects
     */
    public void setImages(List<ProductImage> images) {
        this.images = images;
    }

    /**
     * Add an image to the product
     * 
     * @param image ProductImage to add
     */
    public void addImage(ProductImage image) {
        images.add(image);
        image.setProduct(this);
    }

    /**
     * Remove an image from the product
     * 
     * @param image ProductImage to remove
     */
    public void removeImage(ProductImage image) {
        images.remove(image);
        image.setProduct(null);
    }

    /**
     * Initialize the images list if it's null
     * Prevents NullPointerException when accessing images
     */
    public void initializeImages() {
        if (this.images == null) {
            this.images = new ArrayList<>();
        }
    }

    @Override
    public String toString() {
        return "Products{" +
                "productId=" + productId +
                ", productName='" + productName + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                ", imagesCount=" + (images != null ? images.size() : 0) +
                '}';
    }
}

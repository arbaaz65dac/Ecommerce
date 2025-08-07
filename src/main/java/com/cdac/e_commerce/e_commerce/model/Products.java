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

@Entity
@Table(name = "products")
public class Products {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category categoryId;


    @Column
    private String productName;

  
    @Column
    private Double price;

    @Column
    private Integer quantity;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductImage> images = new ArrayList<>(); 

    public Products() {
    }

    public Products(Integer productId, Category categoryId, String productName, Double price, Integer quantity) {
        this.productId = productId;
        this.categoryId = categoryId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
    }

    

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


    public List<ProductImage> getImages() {
        return images;
    }

 
    public void setImages(List<ProductImage> images) {
        this.images = images;
    }


    public void addImage(ProductImage image) {
        images.add(image);
        image.setProduct(this);
    }


    public void removeImage(ProductImage image) {
        images.remove(image);
        image.setProduct(null);
    }

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

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
public class ProductImage {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "image_url_1") 
    private String img1;

    @Column(name = "image_url_2") 
    private String img2;

    @Column(name = "image_url_3") 
    private String img3;

    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "product_id") 
    private Products product; 

    
    public ProductImage() {
    }

    
    public ProductImage(String img1, String img2, String img3, Products product) {
        this.img1 = img1;
        this.img2 = img2;
        this.img3 = img3;
        this.product = product;
    }

    
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getImg1() {
        return img1;
    }

    public void setImg1(String img1) {
        this.img1 = img1;
    }

    public String getImg2() {
        return img2;
    }

    public void setImg2(String img2) {
        this.img2 = img2;
    }

    public String getImg3() {
        return img3;
    }

    public void setImg3(String img3) {
        this.img3 = img3;
    }

    public Products getProduct() {
        return product;
    }

    public void setProduct(Products product) {
        this.product = product;
    }

    @Override
    public String toString() {
        return "Image [id=" + id + ", img1=" + img1 + ", img2=" + img2 + ", img3=" + img3 + ", product=" + (product != null ? product.getProductId() : "null") + "]";
    }
}
package com.cdac.e_commerce.e_commerce.ModelDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ImageDto {

    private Integer id; // ID for existing images, usually not validated for new ones

    @NotBlank(message = "Image 1 URL cannot be blank")
    @Size(max = 255, message = "Image 1 URL cannot exceed 255 characters")
    private String img1;

    // img2 and img3 are optional, so no @NotBlank, but limit size
    @Size(max = 255, message = "Image 2 URL cannot exceed 255 characters")
    private String img2;

    @Size(max = 255, message = "Image 3 URL cannot exceed 255 characters")
    private String img3;

    // Product ID is optional for new images (will be set after product creation)
    private Integer productId;


    public ImageDto() {
    }


    public ImageDto(Integer id, String img1, String img2, String img3, Integer productId) {
        this.id = id;
        this.img1 = img1;
        this.img2 = img2;
        this.img3 = img3;
        this.productId = productId;
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

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    @Override
    public String toString() {
        return "ImageDto [id=" + id + ", img1=" + img1 + ", img2=" + img2 + ", img3=" + img3 + ", productId=" + productId + "]";
    }
}
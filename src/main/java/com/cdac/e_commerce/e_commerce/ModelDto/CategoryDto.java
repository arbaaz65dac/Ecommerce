package com.cdac.e_commerce.e_commerce.ModelDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryDto {

 private Integer categoryId; 

 @NotBlank(message = "Category name is mandatory")
 @Size(min = 2, max = 50, message = "Category name must be between 2 and 50 characters")
 private String categoryName;

 @NotBlank(message = "Category description is mandatory")
 @Size(min = 10, max = 255, message = "Category description must be between 10 and 255 characters")
 private String categoryDescription;

 @NotBlank(message = "Category URL is mandatory")
 @Size(max = 255, message = "Category URL cannot exceed 255 characters")
 private String categoryUrl;

 // Constructors
 public CategoryDto() {
 }

 public CategoryDto(Integer categoryId, String categoryName, String categoryDescription, String categoryUrl) {
     this.categoryId = categoryId;
     this.categoryName = categoryName;
     this.categoryDescription = categoryDescription;
     this.categoryUrl = categoryUrl;
 }

 // Getters and Setters
 public Integer getCategoryId() {
     return categoryId;
 }

 public void setCategoryId(Integer categoryId) {
     this.categoryId = categoryId;
 }

 public String getCategoryName() {
     return categoryName;
 }

 public void setCategoryName(String categoryName) {
     this.categoryName = categoryName;
 }

 public String getCategoryDescription() {
     return categoryDescription;
 }

 public void setCategoryDescription(String categoryDescription) {
     this.categoryDescription = categoryDescription;
 }

 public String getCategoryUrl() {
     return categoryUrl;
 }

 public void setCategoryUrl(String categoryUrl) {
     this.categoryUrl = categoryUrl;
 }
}
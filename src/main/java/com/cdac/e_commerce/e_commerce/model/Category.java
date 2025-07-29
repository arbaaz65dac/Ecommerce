package com.cdac.e_commerce.e_commerce.model;

import jakarta.persistence.CascadeType; 
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany; 
import jakarta.persistence.Table; 
import java.util.ArrayList; 
import java.util.List; 
@Entity 
@Table(name = "categories") 
public class Category {

	    @Id 
	    @GeneratedValue(strategy = GenerationType.IDENTITY) 
	    private Integer categoryId;

	    @Column 
	    private String categoryName;

	    @Column 
	    private String categoryDescription;

	    @Column 
	    private String categoryUrl;

       
        @OneToMany(mappedBy = "categoryId", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
        private List<Products> products = new ArrayList<>(); 


		public Category() {
            
		}

		public Category(String categoryName, String categoryDescription, String categoryUrl) {
			this.categoryName = categoryName;
			this.categoryDescription = categoryDescription;
			this.categoryUrl = categoryUrl;
		}

       
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

        // Getter and Setter for the products list
        public List<Products> getProducts() {
            return products;
        }

        public void setProducts(List<Products> products) {
            this.products = products;
        }

        
        public void addProduct(Products product) {
            products.add(product);
            product.setCategoryId(this); 
        }

        public void removeProduct(Products product) {
            products.remove(product);
            product.setCategoryId(null); 
        }

		@Override
		public String toString() {
			return "Category [categoryId=" + categoryId + ", categoryName=" + categoryName + ", categoryDescription="
					+ categoryDescription + ", categoryUrl=" + categoryUrl + "]";
		}
}

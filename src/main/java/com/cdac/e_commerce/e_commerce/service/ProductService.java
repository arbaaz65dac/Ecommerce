package com.cdac.e_commerce.e_commerce.service;

import com.cdac.e_commerce.e_commerce.model.Products;
import com.cdac.e_commerce.e_commerce.repository.ProductRepository;
import com.cdac.e_commerce.e_commerce.exception.ProductNotFoundException; 
import org.springframework.beans.BeanUtils; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Products addProduct(Products product) {
        return productRepository.save(product);
    }

    public List<Products> getAllProducts() {
        return productRepository.findAll();
    }

    public Products getProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product with ID " + id + " not found."));
    }

    public List<Products> getProductsByProductNameContaining(String name) {
        return productRepository.findByProductNameContainingIgnoreCase(name);
    }

    public List<Products> getProductsByCategoryId(Integer categoryId) {
        return productRepository.findByCategoryId_CategoryId(categoryId);
    }

    public Products updateProduct(Integer id, Products updatedProductDetails) {
        Products existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product with ID " + id + " not found for update."));

        BeanUtils.copyProperties(updatedProductDetails, existingProduct, "productId"); 
        if (updatedProductDetails.getCategoryId() != null) {
            existingProduct.setCategoryId(updatedProductDetails.getCategoryId());
        }

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException("Product with ID " + id + " not found for deletion.");
        }
        productRepository.deleteById(id);
    }

    public void deleteProduct(Products product) {
        productRepository.delete(product);
    }
}
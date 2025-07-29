package com.cdac.e_commerce.e_commerce.service;

import com.cdac.e_commerce.e_commerce.model.Products;
import com.cdac.e_commerce.e_commerce.repository.ProductRepository;
import com.cdac.e_commerce.e_commerce.exception.ProductNotFoundException; // Import your custom exception
import org.springframework.beans.BeanUtils; // Import for BeanUtils.copyProperties
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

    // Changed to return Products directly, throws exception if not found
    public Products getProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product with ID " + id + " not found."));
    }

    // These methods return lists, so an empty list is a valid "not found" state,
    // not an error requiring an exception.
    public List<Products> getProductsByProductNameContaining(String name) {
        return productRepository.findByProductNameContainingIgnoreCase(name);
    }

    public List<Products> getProductsByCategoryId(Integer categoryId) {
        return productRepository.findByCategoryId_CategoryId(categoryId);
    }

    // Updated to use BeanUtils and throw exception if not found
    public Products updateProduct(Integer id, Products updatedProductDetails) {
        Products existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product with ID " + id + " not found for update."));

        // Copy non-null properties from updatedProductDetails to existingProduct, excluding the ID
        // Assuming Product model has fields like productName, price, quantity, etc.
        BeanUtils.copyProperties(updatedProductDetails, existingProduct, "productId"); // Exclude ID from copy

        // If category is being updated, ensure it's handled.
        // Assuming updatedProductDetails.getCategoryId() is correctly populated with an already fetched Category object
        // If it's just an ID in the DTO, the controller/conversion handles fetching the Category.
        if (updatedProductDetails.getCategoryId() != null) {
            existingProduct.setCategoryId(updatedProductDetails.getCategoryId());
        }

        // If images are being updated, this logic needs to be robustly handled here
        // or by a separate ImageService. BeanUtils won't deeply copy collections.
        // For simplicity, we assume image updates are managed elsewhere or ProductService
//        if (updatedProductDetails.getImages() != null) {
//             existingProduct.setImages(updatedProductDetails.getImages()); // This might not be suitable for actual image entity management
//        }


        return productRepository.save(existingProduct);
    }

    // Updated to throw exception if not found before deleting
    public void deleteProduct(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException("Product with ID " + id + " not found for deletion.");
        }
        productRepository.deleteById(id);
    }

    // This method can remain as it directly operates on a managed entity
    public void deleteProduct(Products product) {
        productRepository.delete(product);
    }
}
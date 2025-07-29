package com.cdac.e_commerce.e_commerce.repository;

import com.cdac.e_commerce.e_commerce.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List; // Make sure to import List

public interface ImageRepository extends JpaRepository<ProductImage, Integer> {
    List<ProductImage> findByProduct_ProductId(Integer productId);
}
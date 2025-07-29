package com.cdac.e_commerce.e_commerce.repository;

import com.cdac.e_commerce.e_commerce.model.Products; 

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ProductRepository extends JpaRepository<Products, Integer> {

    List<Products> findByProductNameContainingIgnoreCase(String name);

    
    List<Products> findByCategoryId_CategoryId(Integer categoryId);
}

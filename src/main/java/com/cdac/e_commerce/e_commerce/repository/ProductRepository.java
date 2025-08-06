package com.cdac.e_commerce.e_commerce.repository;

import com.cdac.e_commerce.e_commerce.model.Products; 

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface ProductRepository extends JpaRepository<Products, Integer> {

    @EntityGraph(attributePaths = {"images", "categoryId"})
    List<Products> findAll();
    
    @EntityGraph(attributePaths = {"images", "categoryId"})
    Optional<Products> findById(Integer id);
    
    @EntityGraph(attributePaths = {"images", "categoryId"})
    List<Products> findByProductNameContainingIgnoreCase(String name);

    @EntityGraph(attributePaths = {"images", "categoryId"})
    List<Products> findByCategoryId_CategoryId(Integer categoryId);
    
    @Override
    @EntityGraph(attributePaths = {"images", "categoryId"})
    boolean existsById(Integer id);
}

package com.cdac.e_commerce.e_commerce.repository;

import com.cdac.e_commerce.e_commerce.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // Make sure to import Optional

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    // This method needs to return Optional for proper exception handling in service
    Optional<Category> findByCategoryName(String categoryName);
}
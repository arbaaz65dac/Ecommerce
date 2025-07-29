package com.cdac.e_commerce.e_commerce.service;

import com.cdac.e_commerce.e_commerce.model.Category;
import com.cdac.e_commerce.e_commerce.repository.CategoryRepository;
import com.cdac.e_commerce.e_commerce.exception.CategoryNotFoundException; // Import your custom exception
import org.springframework.beans.BeanUtils; // Import for BeanUtils.copyProperties
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category addCategory(Category category) {
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Changed to return Category directly, throws exception if not found
    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category with ID " + id + " not found."));
    }

    // Changed to return Category directly, throws exception if not found
    public Category getCategoryByName(String categoryName) {
        return categoryRepository.findByCategoryName(categoryName) // Assumes repository returns Optional
                .orElseThrow(() -> new CategoryNotFoundException("Category with name '" + categoryName + "' not found."));
    }

    // Updated to use BeanUtils and throw exception if not found
    public Category updateCategory(Integer id, Category updatedCategoryDetails) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category with ID " + id + " not found for update."));

        // Copy non-null properties from updatedCategoryDetails to existingCategory, excluding the ID
        BeanUtils.copyProperties(updatedCategoryDetails, existingCategory, "categoryId");

        return categoryRepository.save(existingCategory);
    }

    // Updated to throw exception if not found before deleting
    public void deleteCategory(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new CategoryNotFoundException("Category with ID " + id + " not found for deletion.");
        }
        categoryRepository.deleteById(id);
    }

    // This method can remain as it directly operates on a managed entity
    public void deleteCategory(Category category) {
        categoryRepository.delete(category);
    }
}
package com.cdac.e_commerce.e_commerce.service;

import com.cdac.e_commerce.e_commerce.model.Category;
import com.cdac.e_commerce.e_commerce.repository.CategoryRepository;
import com.cdac.e_commerce.e_commerce.exception.CategoryNotFoundException; 
import org.springframework.beans.BeanUtils; 
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

    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category with ID " + id + " not found."));
    }

    public Category getCategoryByName(String categoryName) {
        return categoryRepository.findByCategoryName(categoryName) 
                .orElseThrow(() -> new CategoryNotFoundException("Category with name '" + categoryName + "' not found."));
    }

    public Category updateCategory(Integer id, Category updatedCategoryDetails) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category with ID " + id + " not found for update."));

        BeanUtils.copyProperties(updatedCategoryDetails, existingCategory, "categoryId");

        return categoryRepository.save(existingCategory);
    }

    public void deleteCategory(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new CategoryNotFoundException("Category with ID " + id + " not found for deletion.");
        }
        categoryRepository.deleteById(id);
    }
    public void deleteCategory(Category category) {
        categoryRepository.delete(category);
    }
}
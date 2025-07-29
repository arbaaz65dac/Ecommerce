package com.cdac.e_commerce.e_commerce.controller;

import com.cdac.e_commerce.e_commerce.model.Category;
import com.cdac.e_commerce.e_commerce.ModelDto.CategoryDto;
import com.cdac.e_commerce.e_commerce.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/tricto/categories")
public class CategoryController {

    private final CategoryService categoryService; // Using final with constructor injection

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // Helper method to convert Entity to DTO
    private CategoryDto convertToDto(Category category) {
        if (category == null) {
            return null;
        }
        CategoryDto dto = new CategoryDto();
        BeanUtils.copyProperties(category, dto);
        return dto;
    }

    // Helper method to convert DTO to Entity (for adding/updating)
    private Category convertToEntity(CategoryDto categoryDto) {
        if (categoryDto == null) {
            return null;
        }
        Category entity = new Category();
        BeanUtils.copyProperties(categoryDto, entity);
        return entity;
    }

    @PostMapping
    public ResponseEntity<CategoryDto> addCategory(@RequestBody @Valid CategoryDto categoryDto) {
        Category category = convertToEntity(categoryDto);
        Category savedCategory = categoryService.addCategory(category);
        return new ResponseEntity<>(convertToDto(savedCategory), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        List<CategoryDto> categoryDtos = categories.stream()
                .map(this::convertToDto) // Use method reference for conciseness
                .collect(Collectors.toList());
        return new ResponseEntity<>(categoryDtos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable Integer id) {
        // Service layer now throws CategoryNotFoundException if not found,
        // which is handled by GlobalExceptionHandler.
        Category category = categoryService.getCategoryById(id);
        return new ResponseEntity<>(convertToDto(category), HttpStatus.OK);
    }

    @GetMapping("/byName/{name}")
    public ResponseEntity<CategoryDto> getCategoryByName(@PathVariable String name) {
        // Service layer now throws CategoryNotFoundException if not found.
        Category category = categoryService.getCategoryByName(name);
        return new ResponseEntity<>(convertToDto(category), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Integer id, @RequestBody @Valid CategoryDto categoryDto) {
        Category categoryToUpdate = convertToEntity(categoryDto);
        // Do NOT set ID on categoryToUpdate here. The service method takes the ID
        // and finds the existing entity, then updates its properties.
        // categoryToUpdate.setCategoryId(id); // <--- REMOVE THIS LINE IF YOUR SERVICE HANDLES FINDING BY ID

        Category result = categoryService.updateCategory(id, categoryToUpdate);
        // If result is null, it means no entity was found/updated by the service.
        // However, with the service throwing exceptions, 'result' will never be null
        // if the entity is found. If the entity is not found, an exception is thrown
        // and handled by GlobalExceptionHandler.
        return new ResponseEntity<>(convertToDto(result), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
        // Service layer now throws CategoryNotFoundException if not found.
        categoryService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content for successful deletion
    }
}
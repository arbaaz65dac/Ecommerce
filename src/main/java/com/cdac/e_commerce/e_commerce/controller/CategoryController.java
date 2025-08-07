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

    	private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    
    private CategoryDto convertToDto(Category category) {
        if (category == null) {
            return null;
        }
        CategoryDto dto = new CategoryDto();
        BeanUtils.copyProperties(category, dto);
        return dto;
    }

    
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
                		.map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(categoryDtos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable Integer id) {
        
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

        Category result = categoryService.updateCategory(id, categoryToUpdate);
        return new ResponseEntity<>(convertToDto(result), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
        categoryService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
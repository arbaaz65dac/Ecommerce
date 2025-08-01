package com.cdac.e_commerce.e_commerce.controller;

import com.cdac.e_commerce.e_commerce.model.Products;
import com.cdac.e_commerce.e_commerce.ModelDto.ProductDto;
import com.cdac.e_commerce.e_commerce.ModelDto.ImageDto;
import com.cdac.e_commerce.e_commerce.service.ProductService;
import com.cdac.e_commerce.e_commerce.service.CategoryService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/tricto/products")
public class ProductController {

    private final ProductService productService;
    private final CategoryService categoryService;

    @Autowired
    public ProductController(ProductService productService, CategoryService categoryService) {
        this.productService = productService;
        this.categoryService = categoryService;
    }

    // Helper method to convert Entity to DTO using BeanUtils
    private ProductDto convertToDto(Products product) {
        if (product == null) {
            return null;
        }
        ProductDto dto = new ProductDto();
        BeanUtils.copyProperties(product, dto);

        if (product.getCategoryId() != null) {
            dto.setCategoryId(product.getCategoryId().getCategoryId());
        }

        if (product.getImages() != null) {
            List<ImageDto> imageDtos = product.getImages().stream()
                    .map(image -> {
                        ImageDto imageDto = new ImageDto();
                        BeanUtils.copyProperties(image, imageDto);
                        if (image.getProduct() != null) {
                            imageDto.setProductId(image.getProduct().getProductId());
                        }
                        return imageDto;
                    })
                    .collect(Collectors.toList());
            dto.setImages(imageDtos);
        }
        return dto;
    }

    // Helper method to convert DTO to Entity using BeanUtils
    private Products convertToEntity(ProductDto productDto) {
        if (productDto == null) {
            return null;
        }
        Products product = new Products();
        BeanUtils.copyProperties(productDto, product);

        if (productDto.getCategoryId() != null) {
            // This call will either return a Category object or throw CategoryNotFoundException
            // The thrown exception will be caught by the GlobalExceptionHandler
            product.setCategoryId(categoryService.getCategoryById(productDto.getCategoryId()));
        }
        return product;
    }

    @PostMapping
    public ResponseEntity<ProductDto> addProduct(@RequestBody @Valid ProductDto productDto) {
        Products product = convertToEntity(productDto);
        Products savedProduct = productService.addProduct(product);
        return new ResponseEntity<>(convertToDto(savedProduct), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        List<Products> products = productService.getAllProducts();
        List<ProductDto> productDtos = products.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(productDtos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Integer id) {
        Products product = productService.getProductById(id);
        return new ResponseEntity<>(convertToDto(product), HttpStatus.OK);
    }

    @GetMapping("/byName/{name}")
    public ResponseEntity<List<ProductDto>> getProductsByProductNameContaining(@PathVariable String name) {
        List<Products> products = productService.getProductsByProductNameContaining(name);
        List<ProductDto> productDtos = products.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(productDtos, HttpStatus.OK);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductDto>> getProductsByCategoryId(@PathVariable Integer categoryId) {
        List<Products> products = productService.getProductsByCategoryId(categoryId);
        List<ProductDto> productDtos = products.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(productDtos, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Integer id, @RequestBody @Valid ProductDto productDto) {
        Products updatedProductEntity = convertToEntity(productDto);
        Products result = productService.updateProduct(id, updatedProductEntity);
        return new ResponseEntity<>(convertToDto(result), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
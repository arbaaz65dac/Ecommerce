package com.cdac.e_commerce.e_commerce.controller;

import com.cdac.e_commerce.e_commerce.model.ProductImage;
import com.cdac.e_commerce.e_commerce.ModelDto.ImageDto;
import com.cdac.e_commerce.e_commerce.service.ImageService;
import com.cdac.e_commerce.e_commerce.service.ProductService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/tricto/images")
public class ImageController {

    private final ImageService imageService;
    private final ProductService productService; // Keep final with constructor injection

    @Autowired
    public ImageController(ImageService imageService, ProductService productService) {
        this.imageService = imageService;
        this.productService = productService;
    }

    // Helper method to convert Entity to DTO using BeanUtils
    private ImageDto convertToDto(ProductImage image) {
        if (image == null) {
            return null;
        }
        ImageDto dto = new ImageDto();
        BeanUtils.copyProperties(image, dto);

        if (image.getProduct() != null) {
            dto.setProductId(image.getProduct().getProductId());
        }
        return dto;
    }

    // Helper method to convert DTO to Entity using BeanUtils
    private ProductImage convertToEntity(ImageDto imageDto) {
        if (imageDto == null) {
            return null;
        }
        ProductImage image = new ProductImage();
        BeanUtils.copyProperties(imageDto, image);

        
        if (imageDto.getProductId() != null) {
            // This call will either return a Products object or throw ProductNotFoundException.
            // The thrown exception will be caught by the GlobalExceptionHandler.
            image.setProduct(productService.getProductById(imageDto.getProductId()));
        } else {
            // If productId is explicitly null in the DTO, set the product association to null
            image.setProduct(null);
        }
        return image;
    }

    @PostMapping
    public ResponseEntity<ImageDto> addImage(@RequestBody @Valid ImageDto imageDto) {
        ProductImage image = convertToEntity(imageDto); // This handles product existence via productService call
        ProductImage savedImage = imageService.addImage(image);
        return new ResponseEntity<>(convertToDto(savedImage), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ImageDto>> getAllImages() {
        List<ProductImage> images = imageService.getAllImages();
        List<ImageDto> imageDtos = images.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(imageDtos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImageDto> getImageById(@PathVariable Integer id) {
        // Service layer now throws ImageNotFoundException if not found,
        // which is handled by GlobalExceptionHandler.
        ProductImage image = imageService.getImageById(id);
        return new ResponseEntity<>(convertToDto(image), HttpStatus.OK);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ImageDto>> getImagesByProductId(@PathVariable Integer productId) {
        // The service layer's getImagesByProductId *can* throw ProductNotFoundException
        // if the product itself doesn't exist, due to the call to productService.getProductById(productId)
        List<ProductImage> images = imageService.getImagesByProductId(productId);
        List<ImageDto> imageDtos = images.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(imageDtos, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ImageDto> updateImage(@PathVariable Integer id, @RequestBody @Valid ImageDto imageDto) {
        ProductImage updatedImageEntity = convertToEntity(imageDto); // This handles product existence
        // The service layer will find the image by 'id' and update its details
        ProductImage result = imageService.updateImage(id, updatedImageEntity);
        // If result is null/not found, an exception is thrown from service and handled globally
        return new ResponseEntity<>(convertToDto(result), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Integer id) {
        // Service layer will throw ImageNotFoundException if not found
        imageService.deleteImage(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content for successful deletion
    }
}
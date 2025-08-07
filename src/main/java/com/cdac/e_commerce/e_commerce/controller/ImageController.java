package com.cdac.e_commerce.e_commerce.controller;

import com.cdac.e_commerce.e_commerce.model.ProductImage;
import com.cdac.e_commerce.e_commerce.model.Products;
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
    private final ProductService productService;

    @Autowired
    public ImageController(ImageService imageService, ProductService productService) {
        this.imageService = imageService;
        this.productService = productService;
    }

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

    @PostMapping
    public ResponseEntity<ImageDto> addImage(@RequestBody @Valid ImageDto imageDto) {
       
        if (imageDto.getProductId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        try {
            Products product = productService.getProductById(imageDto.getProductId());
           
            ProductImage savedImage = imageService.createImage(
                imageDto.getImg1(), 
                imageDto.getImg2(), 
                imageDto.getImg3(), 
                product
            );
            return new ResponseEntity<>(convertToDto(savedImage), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


}
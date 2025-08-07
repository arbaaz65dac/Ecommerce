package com.cdac.e_commerce.e_commerce.service;

import com.cdac.e_commerce.e_commerce.model.ProductImage;
import com.cdac.e_commerce.e_commerce.model.Products;
import com.cdac.e_commerce.e_commerce.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImageService {

    private final ImageRepository imageRepository;

    @Autowired
    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public ProductImage createImage(String img1, String img2, String img3, Products product) {
        ProductImage image = new ProductImage(img1, img2, img3, product);
        return imageRepository.save(image);
    }

    public List<ProductImage> createImagesForProduct(List<String> imageUrls, Products product) {

        if (imageUrls == null || imageUrls.isEmpty()) {
            return List.of();
        }

        String img1 = imageUrls.size() > 0 ? imageUrls.get(0) : "";
        String img2 = imageUrls.size() > 1 ? imageUrls.get(1) : "";
        String img3 = imageUrls.size() > 2 ? imageUrls.get(2) : "";

        ProductImage image = createImage(img1, img2, img3, product);
        return List.of(image);
    }
}
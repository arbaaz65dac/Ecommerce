package com.cdac.e_commerce.e_commerce.service;

import com.cdac.e_commerce.e_commerce.model.ProductImage;
import com.cdac.e_commerce.e_commerce.model.Products; // Import Products model
import com.cdac.e_commerce.e_commerce.repository.ImageRepository;
import com.cdac.e_commerce.e_commerce.exception.ImageNotFoundException; // Import your custom exception
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class ImageService {

    private final ImageRepository imageRepository;
    private final ProductService productService; // Inject ProductService here

    @Autowired
    public ImageService(ImageRepository imageRepository, ProductService productService) {
        this.imageRepository = imageRepository;
        this.productService = productService;
    }

    public ProductImage addImage(ProductImage image) {
        // Ensure the associated product exists before saving the image
        if (image.getProduct() != null && image.getProduct().getProductId() != null) {
            // This call will throw ProductNotFoundException if the product does not exist
            Products product = productService.getProductById(image.getProduct().getProductId());
            image.setProduct(product); // Ensure the managed entity is set if not already
        } else {
            // If productId is null or product object is null, decide how to handle (e.g., throw error or allow null)
            // For now, we'll assume productId must be present for a new image.
            // If you want images to exist without a product, adjust validation in ImageDto and remove this check.
            throw new IllegalArgumentException("Product ID is required for adding an image.");
        }
        return imageRepository.save(image);
    }

    public List<ProductImage> getAllImages() {
        return imageRepository.findAll();
    }

    // Changed to return ProductImage directly, throws exception if not found
    public ProductImage getImageById(Integer id) {
        return imageRepository.findById(id)
                .orElseThrow(() -> new ImageNotFoundException("Image with ID " + id + " not found."));
    }

    public List<ProductImage> getImagesByProductId(Integer productId) {
        // Optional: Validate if the product itself exists before fetching its images
        // This will throw ProductNotFoundException if the parent product does not exist
        productService.getProductById(productId);
        return imageRepository.findByProduct_ProductId(productId);
    }

    // Updated to use BeanUtils and throw exception if not found
    public ProductImage updateImage(Integer id, ProductImage updatedImageDetails) {
        ProductImage existingImage = imageRepository.findById(id)
                .orElseThrow(() -> new ImageNotFoundException("Image with ID " + id + " not found for update."));

        // Copy scalar properties (img1, img2, img3). Exclude ID and complex objects like 'product'.
        BeanUtils.copyProperties(updatedImageDetails, existingImage, "id", "product");

        // Handle product association update
        if (updatedImageDetails.getProduct() != null && updatedImageDetails.getProduct().getProductId() != null) {
            // This call will throw ProductNotFoundException if the new product ID does not exist
            Products newProduct = productService.getProductById(updatedImageDetails.getProduct().getProductId());
            existingImage.setProduct(newProduct);
        } else if (updatedImageDetails.getProduct() == null && existingImage.getProduct() != null) {
            // If the updated DTO explicitly sets productId to null, and existing has a product, disassociate
            existingImage.setProduct(null);
        }
        // If updatedImageDetails.getProduct() is null and existingImage.getProduct() is already null, do nothing.

        return imageRepository.save(existingImage);
    }

    // Updated to throw exception if not found before deleting
    public void deleteImage(Integer id) {
        if (!imageRepository.existsById(id)) { // More efficient than findById().orElseThrow for just checking existence
            throw new ImageNotFoundException("Image with ID " + id + " not found for deletion.");
        }
        imageRepository.deleteById(id);
    }

    // This method can remain for internal use or if you pass a fully managed entity
    public void deleteImage(ProductImage image) {
        imageRepository.delete(image);
    }
}
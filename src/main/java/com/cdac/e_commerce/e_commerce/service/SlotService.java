package com.cdac.e_commerce.e_commerce.service;

import com.cdac.e_commerce.e_commerce.model.Slot;
import com.cdac.e_commerce.e_commerce.model.Products; // Import Products model
import com.cdac.e_commerce.e_commerce.repository.SlotRepository;
import com.cdac.e_commerce.e_commerce.exception.SlotNotFoundException; // Import your custom exception
import org.springframework.beans.BeanUtils; // Import BeanUtils
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class SlotService {

    private final SlotRepository slotRepository;
    private final ProductService productService; // Inject ProductService

    @Autowired
    public SlotService(SlotRepository slotRepository, ProductService productService) {
        this.slotRepository = slotRepository;
        this.productService = productService;
    }

    public Slot addSlot(Slot slot) {
        // Ensure the associated product exists before saving the slot
        if (slot.getProduct() != null && slot.getProduct().getProductId() != null) {
            // This call will throw ProductNotFoundException if the product does not exist
            Products product = productService.getProductById(slot.getProduct().getProductId());
            slot.setProduct(product); // Ensure the managed entity is set if not already
        } else {
            // If productId is null or product object is null, slots must be associated with a product
            throw new IllegalArgumentException("Product ID is required for adding a slot.");
        }
        return slotRepository.save(slot);
    }

    public List<Slot> getAllSlots() {
        return slotRepository.findAll();
    }

    // Changed to return Slot directly, throws exception if not found
    public Slot getSlotById(Integer id) {
        return slotRepository.findById(id)
                .orElseThrow(() -> new SlotNotFoundException("Slot with ID " + id + " not found."));
    }

    public List<Slot> getSlotsByProductId(Integer productId) {
        // Validate if the product itself exists before fetching its slots
        // This will throw ProductNotFoundException if the parent product does not exist
        productService.getProductById(productId);
        return slotRepository.findByProduct_ProductId(productId);
    }

    // Updated to use BeanUtils and throw exception if not found
    public Slot updateSlot(Integer id, Slot updatedSlotDetails) {
        Slot existingSlot = slotRepository.findById(id)
                .orElseThrow(() -> new SlotNotFoundException("Slot with ID " + id + " not found for update."));

        // Copy scalar properties. Exclude 'slotId' and complex object 'product'.
        BeanUtils.copyProperties(updatedSlotDetails, existingSlot, "slotId", "product");

        // Handle product association update
        if (updatedSlotDetails.getProduct() != null && updatedSlotDetails.getProduct().getProductId() != null) {
            // This call will throw ProductNotFoundException if the new product ID does not exist
            Products newProduct = productService.getProductById(updatedSlotDetails.getProduct().getProductId());
            existingSlot.setProduct(newProduct);
        } else if (updatedSlotDetails.getProduct() == null && existingSlot.getProduct() != null) {
            // If the updated DTO explicitly sets productId to null, and existing has a product, disassociate
            existingSlot.setProduct(null);
        }
        // If updatedSlotDetails.getProduct() is null and existingSlot.getProduct() is already null, do nothing.

        return slotRepository.save(existingSlot);
    }

    // Updated to throw exception if not found before deleting
    public void deleteSlot(Integer id) {
        if (!slotRepository.existsById(id)) { // More efficient than findById().orElseThrow for just checking existence
            throw new SlotNotFoundException("Slot with ID " + id + " not found for deletion.");
        }
        slotRepository.deleteById(id);
    }

    // This method can remain for internal use or if you pass a fully managed entity
    public void deleteSlot(Slot slot) {
        slotRepository.delete(slot);
    }

    // Reset slot method - resets current slot size to 0 and sets isFull to false
    public Slot resetSlot(Integer id) {
        Slot existingSlot = slotRepository.findById(id)
                .orElseThrow(() -> new SlotNotFoundException("Slot with ID " + id + " not found for reset."));
        
        existingSlot.setCurrentSlotSize(0);
        existingSlot.setIsFull(false);
        
        return slotRepository.save(existingSlot);
    }

    // Get slots that are near full (within 5 items of max capacity)
    public List<Slot> getNearFullSlots() {
        List<Slot> allSlots = slotRepository.findAll();
        return allSlots.stream()
                .filter(slot -> !slot.getIsFull() && 
                        slot.getCurrentSlotSize() >= (slot.getMaxSlotSize() - 5))
                .collect(java.util.stream.Collectors.toList());
    }

    // Reset all pending slots (slots that are not full but have current slot size > 0)
    public List<Slot> resetAllPendingSlots() {
        List<Slot> allSlots = slotRepository.findAll();
        List<Slot> fullSlots = allSlots.stream()
                .filter(slot -> slot.getIsFull())
                .collect(java.util.stream.Collectors.toList());
        
        // Reset all full slots
        for (Slot slot : fullSlots) {
            slot.setCurrentSlotSize(0);
            slot.setIsFull(false);
        }
        
        return slotRepository.saveAll(fullSlots);
    }
  
    //edited by shivansh
    public Products getProductobj(Integer slotId) {
        Slot slot = slotRepository.findById(slotId)
            .orElseThrow(() -> new SlotNotFoundException("Slot with ID " + slotId + " not found."));
        return slot.getProduct();
    }

}
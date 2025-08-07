package com.cdac.e_commerce.e_commerce.service;

import com.cdac.e_commerce.e_commerce.model.Slot;
import com.cdac.e_commerce.e_commerce.model.Products; 
import com.cdac.e_commerce.e_commerce.repository.SlotRepository;
import com.cdac.e_commerce.e_commerce.exception.SlotNotFoundException; 
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class SlotService {

    private final SlotRepository slotRepository;
    private final ProductService productService; 

    @Autowired
    public SlotService(SlotRepository slotRepository, ProductService productService) {
        this.slotRepository = slotRepository;
        this.productService = productService;
    }

    public Slot addSlot(Slot slot) {
        if (slot.getProduct() != null && slot.getProduct().getProductId() != null) {
            Products product = productService.getProductById(slot.getProduct().getProductId());
            slot.setProduct(product); 
        } else {
            throw new IllegalArgumentException("Product ID is required for adding a slot.");
        }
        return slotRepository.save(slot);
    }

    public List<Slot> getAllSlots() {
        return slotRepository.findAll();
    }

    public Slot getSlotById(Integer id) {
        return slotRepository.findById(id)
                .orElseThrow(() -> new SlotNotFoundException("Slot with ID " + id + " not found."));
    }

    public List<Slot> getSlotsByProductId(Integer productId) {
        productService.getProductById(productId);
        return slotRepository.findByProduct_ProductId(productId);
    }

    public Slot updateSlot(Integer id, Slot updatedSlotDetails) {
        Slot existingSlot = slotRepository.findById(id)
                .orElseThrow(() -> new SlotNotFoundException("Slot with ID " + id + " not found for update."));

        BeanUtils.copyProperties(updatedSlotDetails, existingSlot, "slotId", "product");

        if (updatedSlotDetails.getProduct() != null && updatedSlotDetails.getProduct().getProductId() != null) {
            Products newProduct = productService.getProductById(updatedSlotDetails.getProduct().getProductId());
            existingSlot.setProduct(newProduct);
        } else if (updatedSlotDetails.getProduct() == null && existingSlot.getProduct() != null) {
            existingSlot.setProduct(null);
        }

        return slotRepository.save(existingSlot);
    }

    public void deleteSlot(Integer id) {
        if (!slotRepository.existsById(id)) { 
            throw new SlotNotFoundException("Slot with ID " + id + " not found for deletion.");
        }
        slotRepository.deleteById(id);
    }

    public void deleteSlot(Slot slot) {
        slotRepository.delete(slot);
    }

    public Slot resetSlot(Integer id) {
        Slot existingSlot = slotRepository.findById(id)
                .orElseThrow(() -> new SlotNotFoundException("Slot with ID " + id + " not found for reset."));
        
        existingSlot.setCurrentSlotSize(0);
        existingSlot.setIsFull(false);
        
        return slotRepository.save(existingSlot);
    }

    public List<Slot> getNearFullSlots() {
        List<Slot> allSlots = slotRepository.findAll();
        return allSlots.stream()
                .filter(slot -> !slot.getIsFull() && 
                        slot.getCurrentSlotSize() >= (slot.getMaxSlotSize() - 5))
                .collect(java.util.stream.Collectors.toList());
    }

    public List<Slot> resetAllPendingSlots() {
        List<Slot> allSlots = slotRepository.findAll();
        List<Slot> fullSlots = allSlots.stream()
                .filter(slot -> slot.getIsFull())
                .collect(java.util.stream.Collectors.toList());
        
        for (Slot slot : fullSlots) {
            slot.setCurrentSlotSize(0);
            slot.setIsFull(false);
        }
        
        return slotRepository.saveAll(fullSlots);
    }
  
    public Products getProductobj(Integer slotId) {
        Slot slot = slotRepository.findById(slotId)
            .orElseThrow(() -> new SlotNotFoundException("Slot with ID " + slotId + " not found."));
        return slot.getProduct();
    }

}
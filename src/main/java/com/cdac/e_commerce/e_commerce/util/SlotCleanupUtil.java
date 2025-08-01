package com.cdac.e_commerce.e_commerce.util;

import com.cdac.e_commerce.e_commerce.model.Slot;
import com.cdac.e_commerce.e_commerce.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class SlotCleanupUtil implements CommandLineRunner {

    @Autowired
    private SlotRepository slotRepository;

    @Override
    public void run(String... args) throws Exception {
        cleanupDuplicateSlots();
    }

    private void cleanupDuplicateSlots() {
        System.out.println("Starting slot cleanup...");
        
        // Get all slots
        List<Slot> allSlots = slotRepository.findAll();
        System.out.println("Total slots found: " + allSlots.size());
        
        // Group slots by product_id and discount_percentage
        Map<String, List<Slot>> groupedSlots = allSlots.stream()
            .collect(Collectors.groupingBy(slot -> 
                slot.getProduct().getProductId() + "-" + slot.getDiscountPercentage()));
        
        int deletedCount = 0;
        
        // For each group, keep only the first slot and delete the rest
        for (Map.Entry<String, List<Slot>> entry : groupedSlots.entrySet()) {
            List<Slot> slots = entry.getValue();
            if (slots.size() > 1) {
                // Keep the first slot, delete the rest
                for (int i = 1; i < slots.size(); i++) {
                    slotRepository.delete(slots.get(i));
                    deletedCount++;
                }
                System.out.println("Cleaned up " + (slots.size() - 1) + " duplicate slots for " + entry.getKey());
            }
        }
        
        System.out.println("Slot cleanup completed. Deleted " + deletedCount + " duplicate slots.");
        
        // Verify cleanup
        List<Slot> remainingSlots = slotRepository.findAll();
        System.out.println("Remaining slots: " + remainingSlots.size());
        
        // Group remaining slots by product to show the structure
        Map<Integer, List<Slot>> slotsByProduct = remainingSlots.stream()
            .collect(Collectors.groupingBy(slot -> slot.getProduct().getProductId()));
        
        for (Map.Entry<Integer, List<Slot>> entry : slotsByProduct.entrySet()) {
            System.out.println("Product " + entry.getKey() + " has " + entry.getValue().size() + " slots");
        }
    }
} 
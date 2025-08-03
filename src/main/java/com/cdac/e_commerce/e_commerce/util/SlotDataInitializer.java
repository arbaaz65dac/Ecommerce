package com.cdac.e_commerce.e_commerce.util;

import com.cdac.e_commerce.e_commerce.model.Slot;
import com.cdac.e_commerce.e_commerce.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Random;

@Component
public class SlotDataInitializer implements CommandLineRunner {

    @Autowired
    private SlotRepository slotRepository;

    @Override
    public void run(String... args) throws Exception {
        List<Slot> allSlots = slotRepository.findAll();
        
        if (allSlots.isEmpty()) {
            System.out.println("No slots found to populate with dummy data.");
            return;
        }

        Random random = new Random();
        int updatedCount = 0;
        int fullSlotsCount = 0;

        for (Slot slot : allSlots) {
            // Generate random current slot size (0 to max slot size)
            int maxSize = slot.getMaxSlotSize();
            int currentSize = random.nextInt(maxSize + 1);
            
            // 10% chance of making a slot full
            boolean isFull = random.nextDouble() < 0.1 && currentSize > 0;
            
            if (isFull) {
                currentSize = maxSize;
                fullSlotsCount++;
            }

            slot.setCurrentSlotSize(currentSize);
            slot.setIsFull(isFull);
            
            slotRepository.save(slot);
            updatedCount++;
        }

        System.out.println("Slot data initialization completed!");
        System.out.println("Updated " + updatedCount + " slots with dummy data");
        System.out.println("Created " + fullSlotsCount + " full slots for testing");
        System.out.println("Total slots: " + allSlots.size());
    }
} 
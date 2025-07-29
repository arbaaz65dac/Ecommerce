package com.cdac.e_commerce.e_commerce.controller;

import com.cdac.e_commerce.e_commerce.model.Slot;
import com.cdac.e_commerce.e_commerce.ModelDto.SlotDto;
import com.cdac.e_commerce.e_commerce.service.SlotService;
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
@RequestMapping("/tricto/slots")
public class SlotController {

    private final SlotService slotService;
    private final ProductService productService;

    @Autowired
    public SlotController(SlotService slotService, ProductService productService) {
        this.slotService = slotService;
        this.productService = productService;
    }

    // Helper method to convert Entity to DTO using BeanUtils
    private SlotDto convertToDto(Slot slot) {
        if (slot == null) {
            return null;
        }
        SlotDto dto = new SlotDto();
        BeanUtils.copyProperties(slot, dto); // Copies slotId, maxSlotSize, isFull, currentSlotSize, discountPercentage

        // Handle productId separately as it's an object in Slot but ID in DTO
        if (slot.getProduct() != null) {
            dto.setProductId(slot.getProduct().getProductId());
        }
        return dto;
    }

    // Helper method to convert DTO to Entity using BeanUtils
    private Slot convertToEntity(SlotDto slotDto) {
        if (slotDto == null) {
            return null;
        }
        Slot slot = new Slot();
        BeanUtils.copyProperties(slotDto, slot); // Copies maxSlotSize, isFull, currentSlotSize, discountPercentage

        // Handle productId: fetch Products entity using the ID from DTO
        // This call will either return a Products object or throw ProductNotFoundException
        // The thrown exception will be caught by the GlobalExceptionHandler
        if (slotDto.getProductId() != null) {
            slot.setProduct(productService.getProductById(slotDto.getProductId()));
        } else {
            // If productId is explicitly null in the DTO, set the product association to null
            slot.setProduct(null);
        }
        return slot;
    }


    @PostMapping
    public ResponseEntity<SlotDto> addSlot(@RequestBody @Valid SlotDto slotDto) {
        Slot slot = convertToEntity(slotDto); // This handles product existence via productService call
        Slot savedSlot = slotService.addSlot(slot);
        return new ResponseEntity<>(convertToDto(savedSlot), HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<List<SlotDto>> getAllSlots() {
        List<Slot> slots = slotService.getAllSlots();
        List<SlotDto> slotDtos = slots.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(slotDtos, HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<SlotDto> getSlotById(@PathVariable Integer id) {
        // Service layer now throws SlotNotFoundException if not found,
        // which is handled by GlobalExceptionHandler.
        Slot slot = slotService.getSlotById(id);
        return new ResponseEntity<>(convertToDto(slot), HttpStatus.OK);
    }


    @GetMapping("/product/{productId}")
    public ResponseEntity<List<SlotDto>> getSlotsByProductId(@PathVariable Integer productId) {
        // The service layer's getSlotsByProductId *can* throw ProductNotFoundException
        // if the product itself doesn't exist, due to the call to productService.getProductById(productId)
        List<Slot> slots = slotService.getSlotsByProductId(productId);
        List<SlotDto> slotDtos = slots.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(slotDtos, HttpStatus.OK);
    }


    @PutMapping("/{id}")
    public ResponseEntity<SlotDto> updateSlot(@PathVariable Integer id, @RequestBody @Valid SlotDto slotDto) {
        Slot updatedSlotEntity = convertToEntity(slotDto); // This handles product existence
        // The service layer will find the slot by 'id' and update its details
        Slot result = slotService.updateSlot(id, updatedSlotEntity);
        // If result is null/not found, an exception is thrown from service and handled globally
        return new ResponseEntity<>(convertToDto(result), HttpStatus.OK);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Integer id) {
        // Service layer will throw SlotNotFoundException if not found
        slotService.deleteSlot(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content for successful deletion
    }
}
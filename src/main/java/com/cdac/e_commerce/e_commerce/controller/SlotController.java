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

/**
 * Slot Controller
 * 
 * This controller handles all slot-related HTTP requests for the e-commerce application.
 * Slots represent discount tiers for products with limited capacity.
 * 
 * API Endpoints:
 * - POST /tricto/slots - Create a new slot
 * - GET /tricto/slots - Get all slots
 * - GET /tricto/slots/{id} - Get slot by ID
 * - GET /tricto/slots/product/{productId} - Get slots for a specific product
 * - PUT /tricto/slots/{id} - Update a slot
 * - DELETE /tricto/slots/{id} - Delete a slot
 * - POST /tricto/slots/{id}/reset - Reset a slot to empty state
 * - POST /tricto/slots/reset-all-pending - Reset all pending slots
 * - GET /tricto/slots/near-full - Get slots that are nearly full
 * 
 * Features:
 * - CRUD operations for slots
 * - Product-slot relationship management
 * - Slot capacity tracking
 * - Discount percentage management
 * - Bulk operations for slot management
 */
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

    /**
     * Converts a Slot entity to SlotDto for API responses
     * 
     * @param slot Slot entity to convert
     * @return SlotDto object
     */
    private SlotDto convertToDto(Slot slot) {
        if (slot == null) {
            return null;
        }
        SlotDto dto = new SlotDto();
        		BeanUtils.copyProperties(slot, dto);
		
        if (slot.getProduct() != null) {
            dto.setProductId(slot.getProduct().getProductId());
        }
        return dto;
    }

    /**
     * Converts a SlotDto to Slot entity for database operations
     * 
     * @param slotDto SlotDto to convert
     * @return Slot entity
     */
    private Slot convertToEntity(SlotDto slotDto) {
        if (slotDto == null) {
            return null;
        }
        Slot slot = new Slot();
        		BeanUtils.copyProperties(slotDto, slot);
		
        if (slotDto.getProductId() != null) {
            slot.setProduct(productService.getProductById(slotDto.getProductId()));
        } else {
            slot.setProduct(null);
        }
        return slot;
    }

    /**
     * Creates a new slot for a product
     * 
     * @param slotDto Slot data to create
     * @return ResponseEntity with created slot
     */
    @PostMapping
    public ResponseEntity<SlotDto> addSlot(@RequestBody @Valid SlotDto slotDto) {
        Slot slot = convertToEntity(slotDto);
        Slot savedSlot = slotService.addSlot(slot);
        return new ResponseEntity<>(convertToDto(savedSlot), HttpStatus.CREATED);
    }

    /**
     * Retrieves all slots in the system
     * 
     * @return ResponseEntity with list of all slots
     */
    @GetMapping
    public ResponseEntity<List<SlotDto>> getAllSlots() {
        List<Slot> slots = slotService.getAllSlots();
        List<SlotDto> slotDtos = slots.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(slotDtos, HttpStatus.OK);
    }

    /**
     * Retrieves a specific slot by its ID
     * 
     * @param id Slot ID
     * @return ResponseEntity with slot data
     */
    @GetMapping("/{id}")
    public ResponseEntity<SlotDto> getSlotById(@PathVariable Integer id) {
        Slot slot = slotService.getSlotById(id);
        return new ResponseEntity<>(convertToDto(slot), HttpStatus.OK);
    }

    /**
     * Retrieves all slots for a specific product
     * 
     * @param productId Product ID
     * @return ResponseEntity with list of slots for the product
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<SlotDto>> getSlotsByProductId(@PathVariable Integer productId) {
        List<Slot> slots = slotService.getSlotsByProductId(productId);
        List<SlotDto> slotDtos = slots.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(slotDtos, HttpStatus.OK);
    }

    /**
     * Updates an existing slot
     * 
     * @param id Slot ID to update
     * @param slotDto Updated slot data
     * @return ResponseEntity with updated slot
     */
    @PutMapping("/{id}")
    public ResponseEntity<SlotDto> updateSlot(@PathVariable Integer id, @RequestBody @Valid SlotDto slotDto) {
        Slot updatedSlotEntity = convertToEntity(slotDto);
        Slot result = slotService.updateSlot(id, updatedSlotEntity);
        return new ResponseEntity<>(convertToDto(result), HttpStatus.OK);
    }

    /**
     * Deletes a slot by its ID
     * 
     * @param id Slot ID to delete
     * @return ResponseEntity with no content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Integer id) {
        slotService.deleteSlot(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Resets a specific slot to empty state
     * 
     * @param id Slot ID to reset
     * @return ResponseEntity with reset slot
     */
    @PostMapping("/{id}/reset")
    public ResponseEntity<SlotDto> resetSlot(@PathVariable Integer id) {
        Slot resetSlot = slotService.resetSlot(id);
        return new ResponseEntity<>(convertToDto(resetSlot), HttpStatus.OK);
    }

    /**
     * Resets all pending slots to empty state
     * 
     * @return ResponseEntity with list of reset slots
     */
    @PostMapping("/reset-all-pending")
    public ResponseEntity<List<SlotDto>> resetAllPendingSlots() {
        List<Slot> resetSlots = slotService.resetAllPendingSlots();
        List<SlotDto> slotDtos = resetSlots.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(slotDtos, HttpStatus.OK);
    }

    /**
     * Retrieves slots that are nearly full (for monitoring purposes)
     * 
     * @return ResponseEntity with list of near-full slots
     */
    @GetMapping("/near-full")
    public ResponseEntity<List<SlotDto>> getNearFullSlots() {
        List<Slot> nearFullSlots = slotService.getNearFullSlots();
        List<SlotDto> slotDtos = nearFullSlots.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(slotDtos, HttpStatus.OK);
    }
}
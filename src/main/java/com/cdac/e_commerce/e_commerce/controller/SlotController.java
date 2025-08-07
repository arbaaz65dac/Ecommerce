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


    @PostMapping
    public ResponseEntity<SlotDto> addSlot(@RequestBody @Valid SlotDto slotDto) {
        Slot slot = convertToEntity(slotDto);
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
        Slot slot = slotService.getSlotById(id);
        return new ResponseEntity<>(convertToDto(slot), HttpStatus.OK);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<SlotDto>> getSlotsByProductId(@PathVariable Integer productId) {
        List<Slot> slots = slotService.getSlotsByProductId(productId);
        List<SlotDto> slotDtos = slots.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(slotDtos, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SlotDto> updateSlot(@PathVariable Integer id, @RequestBody @Valid SlotDto slotDto) {
        Slot updatedSlotEntity = convertToEntity(slotDto);
        Slot result = slotService.updateSlot(id, updatedSlotEntity);
        return new ResponseEntity<>(convertToDto(result), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Integer id) {
        slotService.deleteSlot(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{id}/reset")
    public ResponseEntity<SlotDto> resetSlot(@PathVariable Integer id) {
        Slot resetSlot = slotService.resetSlot(id);
        return new ResponseEntity<>(convertToDto(resetSlot), HttpStatus.OK);
    }

    @PostMapping("/reset-all-pending")
    public ResponseEntity<List<SlotDto>> resetAllPendingSlots() {
        List<Slot> resetSlots = slotService.resetAllPendingSlots();
        List<SlotDto> slotDtos = resetSlots.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(slotDtos, HttpStatus.OK);
    }

    @GetMapping("/near-full")
    public ResponseEntity<List<SlotDto>> getNearFullSlots() {
        List<Slot> nearFullSlots = slotService.getNearFullSlots();
        List<SlotDto> slotDtos = nearFullSlots.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(slotDtos, HttpStatus.OK);
    }
}
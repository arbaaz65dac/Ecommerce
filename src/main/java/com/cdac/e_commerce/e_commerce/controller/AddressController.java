package com.cdac.e_commerce.e_commerce.controller;

import com.cdac.e_commerce.e_commerce.ModelDto.AddressDto;
import com.cdac.e_commerce.e_commerce.service.AddressService;
// No need for Address model import here as controller directly uses DTOs
// No need for custom exception imports here as GlobalExceptionHandler will handle them

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // For ResponseEntity
import org.springframework.http.ResponseEntity; // For explicit HTTP status
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid; // Keep for DTO validation

import java.util.List;

@RestController
@RequestMapping("/tricto/address")
public class AddressController {

    private final AddressService addressService; // Use final with constructor injection if preferred

    @Autowired
    public AddressController(AddressService addressService) { // Constructor injection
        this.addressService = addressService;
    }

    @PostMapping
    public ResponseEntity<AddressDto> createAddress(@RequestBody @Valid AddressDto dto) {
        // Service now directly takes and returns AddressDto
        AddressDto createdAddressDto = addressService.createAddress(dto);
        return new ResponseEntity<>(createdAddressDto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AddressDto>> getAll() {
        // Service now directly returns List<AddressDto>
        List<AddressDto> addressDtos = addressService.getAllAddresses();
        return new ResponseEntity<>(addressDtos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressDto> getById(@PathVariable Integer id) {
        // Service now returns AddressDto or throws AddressNotFoundException
        AddressDto addressDto = addressService.getAddressById(id);
        return new ResponseEntity<>(addressDto, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressDto> updateAddress(@PathVariable Integer id, @RequestBody @Valid AddressDto dto) {
        // Service now directly takes and returns AddressDto
        AddressDto updatedAddressDto = addressService.updateAddress(id, dto);
        return new ResponseEntity<>(updatedAddressDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        // Service now deletes or throws AddressNotFoundException
        addressService.deleteAddress(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content for successful deletion
    }
}
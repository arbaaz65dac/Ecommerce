package com.cdac.e_commerce.e_commerce.controller;

import com.cdac.e_commerce.e_commerce.ModelDto.AddressDto;
import com.cdac.e_commerce.e_commerce.service.AddressService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity; 
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid; 
import java.util.List;

@RestController
@RequestMapping("/tricto/address")
public class AddressController {

    private final AddressService addressService; 

    @Autowired
    public AddressController(AddressService addressService) { 
        this.addressService = addressService;
    }

    @PostMapping
    public ResponseEntity<AddressDto> createAddress(@RequestBody @Valid AddressDto dto) {
        AddressDto createdAddressDto = addressService.createAddress(dto);
        return new ResponseEntity<>(createdAddressDto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AddressDto>> getAll() {
        List<AddressDto> addressDtos = addressService.getAllAddresses();
        return new ResponseEntity<>(addressDtos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressDto> getById(@PathVariable Integer id) {
        AddressDto addressDto = addressService.getAddressById(id);
        return new ResponseEntity<>(addressDto, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressDto> updateAddress(@PathVariable Integer id, @RequestBody @Valid AddressDto dto) {
       
        AddressDto updatedAddressDto = addressService.updateAddress(id, dto);
        return new ResponseEntity<>(updatedAddressDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        addressService.deleteAddress(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
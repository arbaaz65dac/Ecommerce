package com.cdac.e_commerce.e_commerce.service;


import com.cdac.e_commerce.e_commerce.ModelDto.AddressDto;
import java.util.List;

public interface AddressService {
    AddressDto createAddress(AddressDto addressDTO);
    List<AddressDto> getAllAddresses();
    AddressDto getAddressById(Integer id);
    AddressDto updateAddress(Integer id, AddressDto addressDTO);
    void deleteAddress(Integer id);
}


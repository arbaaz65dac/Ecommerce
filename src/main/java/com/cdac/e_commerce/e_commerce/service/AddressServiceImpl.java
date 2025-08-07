package com.cdac.e_commerce.e_commerce.service;

import com.cdac.e_commerce.e_commerce.ModelDto.AddressDto;
import com.cdac.e_commerce.e_commerce.model.Address;
import com.cdac.e_commerce.e_commerce.model.User;
import com.cdac.e_commerce.e_commerce.repository.AddressRepository;
import com.cdac.e_commerce.e_commerce.repository.UserRepository;
import com.cdac.e_commerce.e_commerce.exception.AddressNotFoundException; 
import com.cdac.e_commerce.e_commerce.exception.UserNotFoundException; 

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;


    private AddressDto convertToDto(Address address) {
        if (address == null) {
            return null;
        }
        AddressDto dto = new AddressDto();
        BeanUtils.copyProperties(address, dto); 
        if (address.getUser() != null) {
            dto.setUserId(address.getUser().getId()); 
        }
        return dto;
    }

    private Address convertToEntity(AddressDto dto) {
        if (dto == null) {
            return null;
        }
        Address address = new Address();
        BeanUtils.copyProperties(dto, address, "userId"); 
        return address;
    }


    @Override
    public AddressDto createAddress(AddressDto dto) {
        
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User with ID " + dto.getUserId() + " not found."));


        Address address = convertToEntity(dto); 
        address.setUser(user); 

        Address saved = addressRepository.save(address);
        return convertToDto(saved); 
    }

    @Override
    public List<AddressDto> getAllAddresses() {
        return addressRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AddressDto getAddressById(Integer id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new AddressNotFoundException("Address with ID " + id + " not found."));
        return convertToDto(address); 
    }

    @Override
    public AddressDto updateAddress(Integer id, AddressDto dto) {
        Address existingAddress = addressRepository.findById(id)
                .orElseThrow(() -> new AddressNotFoundException("Address with ID " + id + " not found for update."));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User with ID " + dto.getUserId() + " not found for address update."));

        BeanUtils.copyProperties(dto, existingAddress, "id", "userId");

        existingAddress.setUser(user);

        Address updated = addressRepository.save(existingAddress);
        return convertToDto(updated); 
    }

    @Override
    public void deleteAddress(Integer id) {
        if (!addressRepository.existsById(id)) {
            throw new AddressNotFoundException("Address with ID " + id + " not found for deletion.");
        }
        addressRepository.deleteById(id);
    }
}
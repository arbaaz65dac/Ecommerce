package com.cdac.e_commerce.e_commerce.service;

import com.cdac.e_commerce.e_commerce.ModelDto.AddressDto;
import com.cdac.e_commerce.e_commerce.model.Address;
import com.cdac.e_commerce.e_commerce.model.User;
import com.cdac.e_commerce.e_commerce.repository.AddressRepository;
import com.cdac.e_commerce.e_commerce.repository.UserRepository;
import com.cdac.e_commerce.e_commerce.exception.AddressNotFoundException; // Import custom exception
import com.cdac.e_commerce.e_commerce.exception.UserNotFoundException; // Import custom exception

import org.springframework.beans.BeanUtils; // Import BeanUtils
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

    // Helper method to convert Entity (Address) to DTO (AddressDto)
    private AddressDto convertToDto(Address address) {
        if (address == null) {
            return null;
        }
        AddressDto dto = new AddressDto();
        BeanUtils.copyProperties(address, dto); // Copies id, addressLine, pincode
        if (address.getUser() != null) {
            dto.setUserId(address.getUser().getId()); // Manually map user to userId
        }
        return dto;
    }

    // Helper method to convert DTO (AddressDto) to Entity (Address),
    // primarily for updates where the entity already exists.
    // For creation, it will build a new entity.
    private Address convertToEntity(AddressDto dto) {
        if (dto == null) {
            return null;
        }
        Address address = new Address();
        BeanUtils.copyProperties(dto, address, "userId"); // Copy scalar fields, exclude userId as it's for the User object
        return address;
    }


    @Override
    public AddressDto createAddress(AddressDto dto) {
        // Find the user or throw UserNotFoundException
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User with ID " + dto.getUserId() + " not found."));

        // Create a new Address entity
        Address address = convertToEntity(dto); // Copy basic properties
        address.setUser(user); // Set the associated User entity

        Address saved = addressRepository.save(address);
        return convertToDto(saved); // Convert saved entity back to DTO
    }

    @Override
    public List<AddressDto> getAllAddresses() {
        // Stream over entities and convert each to DTO using the helper method
        return addressRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AddressDto getAddressById(Integer id) {
        // Find address or throw AddressNotFoundException
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new AddressNotFoundException("Address with ID " + id + " not found."));
        return convertToDto(address); // Convert found entity to DTO
    }

    @Override
    public AddressDto updateAddress(Integer id, AddressDto dto) {
        // Find existing address or throw AddressNotFoundException
        Address existingAddress = addressRepository.findById(id)
                .orElseThrow(() -> new AddressNotFoundException("Address with ID " + id + " not found for update."));

        // Find the user or throw UserNotFoundException
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User with ID " + dto.getUserId() + " not found for address update."));

        // Copy updated scalar properties from DTO to existing entity.
        // Exclude 'id' (as it's from @PathVariable) and 'userId' (as it maps to 'User' object).
        BeanUtils.copyProperties(dto, existingAddress, "id", "userId");

        // Set the associated User entity explicitly
        existingAddress.setUser(user);

        Address updated = addressRepository.save(existingAddress);
        return convertToDto(updated); // Convert updated entity back to DTO
    }

    @Override
    public void deleteAddress(Integer id) {
        // Check if the address exists before deleting, or throw AddressNotFoundException
        if (!addressRepository.existsById(id)) {
            throw new AddressNotFoundException("Address with ID " + id + " not found for deletion.");
        }
        addressRepository.deleteById(id);
    }
}
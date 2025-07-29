package com.cdac.e_commerce.e_commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cdac.e_commerce.e_commerce.model.Address;

public interface AddressRepository extends JpaRepository<Address, Integer> {
}


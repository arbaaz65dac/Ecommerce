package com.cdac.e_commerce.e_commerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cdac.e_commerce.e_commerce.model.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer>{
	 Optional<Cart> findByProductId(Integer productId);
	 String deleteByProductId(Integer productId);

	
}


package com.cdac.e_commerce.e_commerce.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import  com.cdac.e_commerce.e_commerce.model.Cart;
import com.cdac.e_commerce.e_commerce.exception.CartNotFoundException;
import  com.cdac.e_commerce.e_commerce.repository.CartRepository;

@Service
public class CartServiceImpl implements CartService {

	@Autowired
	CartRepository cartRepo;
	
	@Override
	public String addProduct(Cart cartobj) {
		cartRepo.save(cartobj);
		return "Product Added Successfully!";
	}

	@Override
	public List<Cart> getAllProduct() {
		return cartRepo.findAll();
	}
	
	@Override
	public String deleteByProductId(Integer id) {
		Optional<Cart> cartim = cartRepo.findById(id);
		if (cartim.isPresent()) {
			cartRepo.deleteById(id);
			return "Cart Deleted Successfully";
		}
		return "Cart id is not present";
	}

	public String updateByProductId(Integer id, Cart updatedCart) {
	    Optional<Cart> optionalCart = cartRepo.findById(id);

	    if (optionalCart.isPresent()) {
	        Cart existingCart = optionalCart.get();

	        if (updatedCart.getQuantity() != null)
	            existingCart.setQuantity(updatedCart.getQuantity());

	        if (updatedCart.getUser_id() != null)
	            existingCart.setUser_id(updatedCart.getUser_id());

	        if (updatedCart.getProductId() != null)
	            existingCart.setProductId(updatedCart.getProductId());

	        cartRepo.save(existingCart);
	        return "Cart updated successfully.";
	    } else {
	        return "Cart not found.";
	    }
	}


	@Override
	public Optional<Cart> getProductById(Integer id) {
		return Optional.ofNullable(cartRepo.findById(id).orElseThrow(()-> new CartNotFoundException("Cart not found with id: " + id)));	
	}
}


package com.cdac.e_commerce.e_commerce.service;


import java.util.List;
import java.util.Optional;

import com.cdac.e_commerce.e_commerce.model.Cart;

public interface CartService {
	
public String addProduct(Cart cartobj);
	
	public List<Cart> getAllProduct();
	

	
	public Optional<Cart> getProductById(Integer id);
	
	public String deleteByProductId(Integer id);
	
	public String updateByProductId(Integer id, Cart updatedCart);

}

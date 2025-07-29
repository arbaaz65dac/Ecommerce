package com.cdac.e_commerce.e_commerce.controller;


import java.util.List;
import java.util.Optional;


import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.e_commerce.e_commerce.model.Cart;
import com.cdac.e_commerce.e_commerce.ModelDto.CartDto;
import com.cdac.e_commerce.e_commerce.service.CartService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/tricto/cart")
public class CartController {
	
	@Autowired 
	CartService cartService;
	
	@PostMapping("addProduct")
	public String addProduct(@RequestBody @Valid CartDto cartDTO) {
		Cart cartobj = new Cart();
		BeanUtils.copyProperties(cartDTO, cartobj);
		
		return cartService.addProduct(cartobj);
		
	}
	
	@GetMapping("getAllProduct")
	public List<Cart> getAllProduct(){
		return cartService.getAllProduct();
	}
	
	
	@GetMapping("getProductById/{id}")
	public Optional<Cart> getProductById(@PathVariable Integer id){
		return cartService.getProductById(id);
		
	}
	
	@DeleteMapping("deleteProductById/{id}")
	public String deleteByProductId( @PathVariable Integer id) {
		return cartService.deleteByProductId(id);
	}
	
	@PatchMapping("/updateProductById/{id}")
	public String updateByProductId(@PathVariable Integer id, @RequestBody Cart updatedCart) {
	    return cartService.updateByProductId(id, updatedCart);
	}
	

}


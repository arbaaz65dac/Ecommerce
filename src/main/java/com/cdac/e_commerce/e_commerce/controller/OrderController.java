package com.cdac.e_commerce.e_commerce.controller;


import java.util.List;


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

import com.cdac.e_commerce.e_commerce.model.Orders;
import com.cdac.e_commerce.e_commerce.ModelDto.OrderDto;
import com.cdac.e_commerce.e_commerce.service.OrderService;

@RestController
@RequestMapping("/tricto/orders")
public class OrderController {
	
	@Autowired
	OrderService orderservice;
	
	@PostMapping("addOrder")
	public String addOrder(@RequestBody OrderDto orderDTO) {
		Orders orderobj = new Orders();
		BeanUtils.copyProperties(orderDTO, orderobj);
		
		return orderservice.addOrder(orderobj);
	}
	
	@GetMapping("getAllOrder")
	public List<Orders> getAllOrder(){
		return orderservice.getAllOrder();
	}
	
	@DeleteMapping("deleteOrderById/{id}")
	public String deleteOrderById( @PathVariable Integer id) {
		return orderservice.deleteOrderById(id);
	}
	
	@GetMapping("getOrderById/{id}")
	public Orders getOrderById(@PathVariable Integer id) {
		return orderservice.getOrderById(id);
	}
	
	@PatchMapping("/updateOrderById/{id}")
	public String updateOrderById(
	        @PathVariable Integer id,
	        @RequestBody Orders updatedOrder) {
	    
	    return orderservice.updateOrderById(id, updatedOrder);
	}


}


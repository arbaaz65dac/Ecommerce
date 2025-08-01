package com.cdac.e_commerce.e_commerce.controller;

import java.util.List;
import java.util.stream.Collectors;

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
import com.cdac.e_commerce.e_commerce.ModelDto.OrderItemDto;
import com.cdac.e_commerce.e_commerce.service.OrderService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/tricto/orders")
public class OrderController {
	
	@Autowired
	OrderService orderservice;
	
	@Autowired
	ObjectMapper objectMapper;
	
	@PostMapping("addOrder")
	public String addOrder(@RequestBody OrderDto orderDTO) {
		Orders orderobj = new Orders();
		orderobj.setUser_id(orderDTO.getUser_id());
		orderobj.setSlot_id(orderDTO.getSlot_id());
		
		// Convert items to JSON string
		if (orderDTO.getItems() != null && !orderDTO.getItems().isEmpty()) {
			try {
				String itemsJson = objectMapper.writeValueAsString(orderDTO.getItems());
				orderobj.setItems(itemsJson);
			} catch (JsonProcessingException e) {
				// Handle JSON processing error
				System.err.println("Error converting items to JSON: " + e.getMessage());
			}
		}
		
		return orderservice.addOrder(orderobj);
	}
	
	@GetMapping("getAllOrder")
	public List<OrderDto> getAllOrder(){
		List<Orders> orders = orderservice.getAllOrder();
		return orders.stream().map(order -> {
			OrderDto dto = new OrderDto();
			dto.setUser_id(order.getUser_id());
			dto.setSlot_id(order.getSlot_id());
			
			// Convert JSON string back to items
			if (order.getItems() != null && !order.getItems().isEmpty()) {
				try {
					List<OrderItemDto> items = objectMapper.readValue(order.getItems(), 
						objectMapper.getTypeFactory().constructCollectionType(List.class, OrderItemDto.class));
					dto.setItems(items);
				} catch (JsonProcessingException e) {
					// Handle JSON processing error
					System.err.println("Error converting JSON to items: " + e.getMessage());
				}
			}
			
			return dto;
		}).collect(Collectors.toList());
	}
	
	@DeleteMapping("deleteOrderById/{id}")
	public String deleteOrderById( @PathVariable Integer id) {
		return orderservice.deleteOrderById(id);
	}
	
	@GetMapping("getOrderById/{id}")
	public OrderDto getOrderById(@PathVariable Integer id) {
		Orders order = orderservice.getOrderById(id);
		OrderDto dto = new OrderDto();
		dto.setUser_id(order.getUser_id());
		dto.setSlot_id(order.getSlot_id());
		
		// Convert JSON string back to items
		if (order.getItems() != null && !order.getItems().isEmpty()) {
			try {
				List<OrderItemDto> items = objectMapper.readValue(order.getItems(), 
					objectMapper.getTypeFactory().constructCollectionType(List.class, OrderItemDto.class));
				dto.setItems(items);
			} catch (JsonProcessingException e) {
				// Handle JSON processing error
				System.err.println("Error converting JSON to items: " + e.getMessage());
			}
		}
		
		return dto;
	}
	
	@PatchMapping("/updateOrderById/{id}")
	public String updateOrderById(
	        @PathVariable Integer id,
	        @RequestBody Orders updatedOrder) {
	    
	    return orderservice.updateOrderById(id, updatedOrder);
	}
}


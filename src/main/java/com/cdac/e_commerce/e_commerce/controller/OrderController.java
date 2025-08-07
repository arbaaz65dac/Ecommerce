package com.cdac.e_commerce.e_commerce.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.e_commerce.e_commerce.model.Orders;
import com.cdac.e_commerce.e_commerce.ModelDto.OrderDto;
import com.cdac.e_commerce.e_commerce.ModelDto.OrderItemDto;
import com.cdac.e_commerce.e_commerce.ModelDto.UserDto;
import com.cdac.e_commerce.e_commerce.model.User;
import com.cdac.e_commerce.e_commerce.repository.UserRepository;
import com.cdac.e_commerce.e_commerce.service.OrderService;
import com.cdac.e_commerce.e_commerce.security.TokenProvider;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/tricto/orders")
public class OrderController {
	
	@Autowired
	OrderService orderservice;
	
	@Autowired
	ObjectMapper objectMapper;
	
	@Autowired
	TokenProvider tokenProvider;
	
	@Autowired
	UserRepository userRepository;
	
	@PostMapping("addOrder")
	public String addOrder(@RequestBody OrderDto orderDTO) {
		Orders orderobj = new Orders();
		orderobj.setUser_id(orderDTO.getUser_id());
		orderobj.setSlot_id(orderDTO.getSlot_id());
		
		if (orderDTO.getItems() != null && !orderDTO.getItems().isEmpty()) {
			try {
				String itemsJson = objectMapper.writeValueAsString(orderDTO.getItems());
				orderobj.setItems(itemsJson);
			} catch (JsonProcessingException e) {
				System.err.println("Error converting items to JSON: " + e.getMessage());
			}
		}
		
		return orderservice.addOrder(orderobj);
	}
	
	@GetMapping("getAllOrder")
	public List<OrderDto> getAllOrder(HttpServletRequest request){
		Integer currentUserId = (Integer) request.getAttribute("userId");
		String userRole = (String) request.getAttribute("userRole");
		
		if (currentUserId == null) {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			if (authentication != null && authentication.isAuthenticated()) {
				try {
					String authHeader = request.getHeader("Authorization");
					if (authHeader != null && authHeader.startsWith("Bearer ")) {
						String token = authHeader.substring(7);
						currentUserId = tokenProvider.extractUserId(token);
					}
				} catch (Exception e) {
					System.err.println("Error extracting user ID from token: " + e.getMessage());
				}
			}
		}
		
		try {
			List<Orders> allOrders = orderservice.getAllOrder();
			
			if ("ADMIN".equals(userRole)) {
				return allOrders.stream().map(order -> {
					OrderDto dto = new OrderDto();
					dto.setUser_id(order.getUser_id());
					dto.setSlot_id(order.getSlot_id());
					
					if (order.getItems() != null && !order.getItems().isEmpty()) {
						try {
							List<OrderItemDto> items = objectMapper.readValue(order.getItems(), 
								objectMapper.getTypeFactory().constructCollectionType(List.class, OrderItemDto.class));
							dto.setItems(items);
						} catch (JsonProcessingException e) {
							System.err.println("Error converting JSON to items: " + e.getMessage());
						}
					}
					
					return dto;
				}).collect(Collectors.toList());
			}
			if (currentUserId == null) {
				return List.of();
			}
			
			final Integer finalUserId = currentUserId;
			
			List<Orders> userOrders = allOrders.stream()
				.filter(order -> order.getUser_id().equals(finalUserId))
				.collect(Collectors.toList());
			
			return userOrders.stream().map(order -> {
				OrderDto dto = new OrderDto();
				dto.setUser_id(order.getUser_id());
				dto.setSlot_id(order.getSlot_id());
				
				if (order.getItems() != null && !order.getItems().isEmpty()) {
					try {
						List<OrderItemDto> items = objectMapper.readValue(order.getItems(), 
							objectMapper.getTypeFactory().constructCollectionType(List.class, OrderItemDto.class));
						dto.setItems(items);
					} catch (JsonProcessingException e) {
						System.err.println("Error converting JSON to items: " + e.getMessage());
					}
				}
				
				return dto;
			}).collect(Collectors.toList());
		} catch (Exception e) {
			System.err.println("Error fetching orders: " + e.getMessage());
			return List.of();
		}
	}
	
	@GetMapping("getAllOrdersForAdmin")
	public List<OrderDto> getAllOrdersForAdmin(HttpServletRequest request){
		try {
			List<Orders> allOrders = orderservice.getAllOrder();
			
			return allOrders.stream().map(order -> {
				OrderDto dto = new OrderDto();
				dto.setOrderId(order.getId());
				dto.setUser_id(order.getUser_id());
				dto.setSlot_id(order.getSlot_id());
				dto.setStatus("Pending"); 
				dto.setOrderDate(new java.util.Date()); 
				try {
					User user = userRepository.findById(order.getUser_id()).orElse(null);
					if (user != null) {
						UserDto userDto = new UserDto();
						userDto.setId(user.getId());
						userDto.setName(user.getName());
						userDto.setEmail(user.getEmail());
						userDto.setRole(user.getRole().name());
						dto.setUser(userDto);
					}
				} catch (Exception e) {
					System.err.println("Error fetching user for order " + order.getId() + ": " + e.getMessage());
				}
				
				if (order.getItems() != null && !order.getItems().isEmpty()) {
					try {
						List<OrderItemDto> items = objectMapper.readValue(order.getItems(), 
							objectMapper.getTypeFactory().constructCollectionType(List.class, OrderItemDto.class));
						dto.setItems(items);
						
						double totalAmount = items.stream()
							.mapToDouble(item -> (item.getPrice() != null ? item.getPrice() : 0) * (item.getQuantity() != null ? item.getQuantity() : 0))
							.sum();
						dto.setTotalAmount(totalAmount);
					} catch (JsonProcessingException e) {
						System.err.println("Error converting JSON to items: " + e.getMessage());
					}
				}
				
				return dto;
			}).collect(Collectors.toList());
		} catch (Exception e) {
			System.err.println("Error fetching all orders for admin: " + e.getMessage());
			return List.of();
		}
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


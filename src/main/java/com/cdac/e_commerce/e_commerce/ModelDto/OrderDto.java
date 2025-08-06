package com.cdac.e_commerce.e_commerce.ModelDto;

import java.util.List;
import java.util.Date;
import org.springframework.stereotype.Component;
import jakarta.validation.constraints.NotNull;

@Component
public class OrderDto {
	
	@NotNull
	private Integer user_id;
	
	@NotNull
	private Integer slot_id;
	
	private Integer orderId;
	private String status;
	private Date orderDate;
	private Double totalAmount;
	private UserDto user;
	private List<OrderItemDto> items;
	
	public Integer getUser_id() {
		return user_id;
	}
	public void setUser_id(Integer user_id) {
		this.user_id = user_id;
	}
	public Integer getSlot_id() {
		return slot_id;
	}
	public void setSlot_id(Integer slot_id) {
		this.slot_id = slot_id;
	}
	public Integer getOrderId() {
		return orderId;
	}
	public void setOrderId(Integer orderId) {
		this.orderId = orderId;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Date getOrderDate() {
		return orderDate;
	}
	public void setOrderDate(Date orderDate) {
		this.orderDate = orderDate;
	}
	public Double getTotalAmount() {
		return totalAmount;
	}
	public void setTotalAmount(Double totalAmount) {
		this.totalAmount = totalAmount;
	}
	public UserDto getUser() {
		return user;
	}
	public void setUser(UserDto user) {
		this.user = user;
	}
	public List<OrderItemDto> getItems() {
		return items;
	}
	public void setItems(List<OrderItemDto> items) {
		this.items = items;
	}
	
	public OrderDto(Integer user_id, Integer slot_id) {
		super();
		this.user_id = user_id;
		this.slot_id = slot_id;
	}
	
	public OrderDto(Integer user_id, Integer slot_id, List<OrderItemDto> items) {
		super();
		this.user_id = user_id;
		this.slot_id = slot_id;
		this.items = items;
	}
	
	public OrderDto() {
		super();
	}
	
	@Override
	public String toString() {
		return "OrderDTO [orderId=" + orderId + ", user_id=" + user_id + ", slot_id=" + slot_id + ", status=" + status + ", items=" + items + "]";
	}
}

package com.cdac.e_commerce.e_commerce.ModelDto;

import org.springframework.stereotype.Component;

import jakarta.validation.constraints.NotNull;



@Component
public class OrderDto {
	
	@NotNull
	private Integer user_id;
	
	@NotNull
	private Integer slot_id;
	
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
	public OrderDto( Integer user_id, Integer slot_id) {
		super();
		
		this.user_id = user_id;
		this.slot_id = slot_id;
	}
	public OrderDto() {
		super();
		// TODO Auto-generated constructor stub
	}
	@Override
	public String toString() {
		return "OrderDTO [user_id=" + user_id + ", slot_id=" + slot_id + "]";
	}
	
}

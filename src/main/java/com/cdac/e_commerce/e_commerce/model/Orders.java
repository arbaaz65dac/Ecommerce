package com.cdac.e_commerce.e_commerce.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table
public class Orders {
	
	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.IDENTITY) 
	private Integer orderId;
	@Column
	private Integer user_id;
	@Column
	private Integer slot_id;
	@Column(columnDefinition = "TEXT")
	private String items; // JSON string containing order items
	
	public Integer getId() {
		return orderId;
	}
	public void setId(Integer id) {
		this.orderId = id;
	}
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
	public String getItems() {
		return items;
	}
	public void setItems(String items) {
		this.items = items;
	}
	
	public Orders(Integer id, Integer user_id, Integer slot_id) {
		super();
		this.orderId = id;
		this.user_id = user_id;
		this.slot_id = slot_id;
	}
	
	public Orders(Integer id, Integer user_id, Integer slot_id, String items) {
		super();
		this.orderId = id;
		this.user_id = user_id;
		this.slot_id = slot_id;
		this.items = items;
	}
	
	public Orders() {
		super();
	}
	
	@Override
	public String toString() {
		return "order [id=" + orderId + ", user_id=" + user_id + ", slot_id=" + slot_id + ", items=" + items + "]";
	}
}

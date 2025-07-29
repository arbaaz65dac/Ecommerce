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
	public Orders(Integer id, Integer user_id, Integer slot_id) {
		super();
		this.orderId = id;
		this.user_id = user_id;
		this.slot_id = slot_id;
	}
	public Orders() {
		super();
		// TODO Auto-generated constructor stub
	}
	@Override
	public String toString() {
		return "order [id=" + orderId + ", user_id=" + user_id + ", slot_id=" + slot_id + "]";
	}
	
	

}

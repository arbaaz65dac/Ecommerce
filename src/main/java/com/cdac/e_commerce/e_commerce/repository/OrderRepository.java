package com.cdac.e_commerce.e_commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cdac.e_commerce.e_commerce.model.Orders;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Integer> {

}


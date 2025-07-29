package com.cdac.e_commerce.e_commerce.repository;

import com.cdac.e_commerce.e_commerce.model.Slot;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface SlotRepository extends JpaRepository<Slot, Integer> {

    
    List<Slot> findByProduct_ProductId(Integer productId);
}

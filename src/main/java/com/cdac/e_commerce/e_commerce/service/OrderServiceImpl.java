package com.cdac.e_commerce.e_commerce.service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cdac.e_commerce.e_commerce.model.Orders;
import com.cdac.e_commerce.e_commerce.model.Products;
import com.cdac.e_commerce.e_commerce.model.Slot;
import com.cdac.e_commerce.e_commerce.exception.OrderNotFoundException;
import com.cdac.e_commerce.e_commerce.exception.SlotNotFoundException;
import com.cdac.e_commerce.e_commerce.repository.OrderRepository;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepo;
    
    @Autowired
    private ProductService ps;
    
    @Autowired
    private SlotService slotService;

    @Override
    @Transactional
    public String addOrder(Orders orderobj) {
        // Save the order first
        orderRepo.save(orderobj);
        
       
        // Increment slot count if slot_id is provided
        if (orderobj.getSlot_id() != null) {
            try {
                Slot slot = slotService.getSlotById(orderobj.getSlot_id());
                
                // Check if slot is not full
                if (!slot.getIsFull()) {
                    // Increment current slot size by 1
                	
                	//edited by shivansh*******
                	Products temp=	slot.getProduct();
                	temp.setQuantity(temp.getQuantity()-1);
                	//*****
                	
                    int newCurrentSize = slot.getCurrentSlotSize() + 1;
                    slot.setCurrentSlotSize(newCurrentSize);
                    
                    // Check if slot is now full
                    if (newCurrentSize >= slot.getMaxSlotSize()) {
                        slot.setIsFull(true);
                    }
                    
                    // Save the updated slot
                    slotService.updateSlot(slot.getSlotId(), slot);
                    
                    System.out.println("Slot " + slot.getSlotId() + " count incremented to " + newCurrentSize);
                } else {
                    System.out.println("Slot " + slot.getSlotId() + " is already full, cannot increment");
                }
            } catch (SlotNotFoundException e) {
                System.err.println("Slot not found with ID: " + orderobj.getSlot_id());
                // Continue with order processing even if slot update fails
            } catch (Exception e) {
                System.err.println("Error updating slot count: " + e.getMessage());
                // Continue with order processing even if slot update fails
            }
        }
        
        return "Order Added Successfully";
    }

    @Override
    public List<Orders> getAllOrder() {
        return orderRepo.findAll();
    }

    @Override
    public String deleteOrderById(Integer id) {
       Optional<Orders> order = orderRepo.findById(id);
        if (order.isPresent()) {
            orderRepo.deleteById(id);
          //edited by shivansh*******
        	Orders tempOrder = order.get();
            Products temp = slotService.getSlotById(tempOrder.getSlot_id()).getProduct();
        	temp.setQuantity(temp.getQuantity()+1);
		    ps.updateProduct(temp.getProductId(), temp);
        	//*****
            return "Order Deleted Successfully";
        } else {
            throw new OrderNotFoundException("Order not found with ID: " + id);
        }
    }
    
    @Override
    public String updateOrderById(Integer id, Orders updatedOrder) {
        Optional<Orders> optionalOrder = orderRepo.findById(id);

        if (optionalOrder.isPresent()) {
            Orders existingOrder = optionalOrder.get();

            if (updatedOrder.getUser_id() != null) {
                existingOrder.setUser_id(updatedOrder.getUser_id());
            }

            if (updatedOrder.getSlot_id() != null) {
                existingOrder.setSlot_id(updatedOrder.getSlot_id());
            }

            orderRepo.save(existingOrder);
            return "Order updated successfully.";
        } else {
            return "Order not found.";
        }
    }


    @Override
    public Orders getOrderById(Integer id) {
        return orderRepo.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + id));
    }
}


package com.cdac.e_commerce.e_commerce.service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cdac.e_commerce.e_commerce.model.Orders;
import com.cdac.e_commerce.e_commerce.exception.OrderNotFoundException;
import com.cdac.e_commerce.e_commerce.repository.OrderRepository;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepo;

    @Override
    public String addOrder(Orders orderobj) {
        orderRepo.save(orderobj);
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


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
import com.cdac.e_commerce.e_commerce.service.ProductService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepo;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private SlotService slotService;

    @Override
    @Transactional
    public String addOrder(Orders orderobj) {
        orderRepo.save(orderobj);
        
        if (orderobj.getItems() != null && !orderobj.getItems().isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                List<Map<String, Object>> orderItems = objectMapper.readValue(
                    orderobj.getItems(), 
                    new TypeReference<List<Map<String, Object>>>() {}
                );
                
                for (Map<String, Object> item : orderItems) {
                    Integer productId = (Integer) item.get("productId");
                    Integer quantity = (Integer) item.get("quantity");
                    
                    if (productId != null && quantity != null) {
                        try {
                            Products product = productService.getProductById(productId);
                            product.setQuantity(product.getQuantity() - quantity);
                            productService.updateProduct(product.getProductId(), product);
                            
                            System.out.println("Decreased " + quantity + " units of product " + productId);
                        } catch (Exception e) {
                            System.err.println("Error updating product " + productId + ": " + e.getMessage());
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Error parsing order items: " + e.getMessage());
            }
        }
        
        if (orderobj.getSlot_id() != null) {
            try {
                Slot slot = slotService.getSlotById(orderobj.getSlot_id());
                
                if (!slot.getIsFull()) {
                    int newCurrentSize = slot.getCurrentSlotSize() + 1;
                    slot.setCurrentSlotSize(newCurrentSize);
                    
                    if (newCurrentSize >= slot.getMaxSlotSize()) {
                        slot.setIsFull(true);
                    }
                    
                    slotService.updateSlot(slot.getSlotId(), slot);
                    
                    System.out.println("Slot " + slot.getSlotId() + " count incremented to " + newCurrentSize);
                } else {
                    System.out.println("Slot " + slot.getSlotId() + " is already full, cannot increment");
                }
            } catch (SlotNotFoundException e) {
                System.err.println("Slot not found with ID: " + orderobj.getSlot_id());
            } catch (Exception e) {
                System.err.println("Error updating slot count: " + e.getMessage());
            }
        }
        
        return "Order Added Successfully";
    }

    @Override
    public List<Orders> getAllOrder() {
        return orderRepo.findAll();
    }

        @Override
    @Transactional
    public String deleteOrderById(Integer id) {
        Optional<Orders> order = orderRepo.findById(id);
        if (order.isPresent()) {
            Orders tempOrder = order.get();
            
            if (tempOrder.getItems() != null && !tempOrder.getItems().isEmpty()) {
                try {
                    ObjectMapper objectMapper = new ObjectMapper();
                    List<Map<String, Object>> orderItems = objectMapper.readValue(
                        tempOrder.getItems(), 
                        new TypeReference<List<Map<String, Object>>>() {}
                    );
                    
                    for (Map<String, Object> item : orderItems) {
                        Integer productId = (Integer) item.get("productId");
                        Integer quantity = (Integer) item.get("quantity");
                        
                        if (productId != null && quantity != null) {
                            try {
                                Products product = productService.getProductById(productId);
                                product.setQuantity(product.getQuantity() + quantity);
                                productService.updateProduct(product.getProductId(), product);
                                
                                System.out.println("Restored " + quantity + " units of product " + productId);
                            } catch (Exception e) {
                                System.err.println("Error updating product " + productId + ": " + e.getMessage());
                            }
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error parsing order items: " + e.getMessage());
                }
            }
            
            if (tempOrder.getSlot_id() != null) {
                try {
                    Slot slot = slotService.getSlotById(tempOrder.getSlot_id());
                    
                    int newCurrentSize = slot.getCurrentSlotSize() - 1;
                    slot.setCurrentSlotSize(newCurrentSize);
                    
                    if (newCurrentSize < slot.getMaxSlotSize()) {
                        slot.setIsFull(false);
                    }
                    
                    slotService.updateSlot(slot.getSlotId(), slot);
                    
                    System.out.println("Slot " + slot.getSlotId() + " count decremented to " + newCurrentSize);
                } catch (SlotNotFoundException e) {
                    System.err.println("Slot not found with ID: " + tempOrder.getSlot_id());
                } catch (Exception e) {
                    System.err.println("Error updating slot count: " + e.getMessage());
                }
            }
            
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


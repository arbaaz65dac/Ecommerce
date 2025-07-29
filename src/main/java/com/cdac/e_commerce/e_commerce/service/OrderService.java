package com.cdac.e_commerce.e_commerce.service;


import java.util.List;

import com.cdac.e_commerce.e_commerce.model.Orders;

public interface OrderService {
    
    String addOrder(Orders orderobj);

    List<Orders> getAllOrder();

    Orders getOrderById(Integer id);

    String deleteOrderById(Integer id);
    
    String updateOrderById(Integer id, Orders updatedOrder);
}

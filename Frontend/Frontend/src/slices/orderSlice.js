import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Place order with backend
export const placeOrder = createAsyncThunk('order/placeOrder', async (orderData, { getState, dispatch }) => {
  try {
    // Get user ID and token from auth state
    const authState = getState().auth;
    
    let userId = null;
    let token = null;
    
    if (authState && authState.profile) {
      userId = authState.profile.id;
      token = authState.profile.token;
    }

    // If no user in state, try localStorage
    if (!userId || !token) {
      const savedAuth = localStorage.getItem('authState');
      if (savedAuth) {
        try {
          const parsedAuth = JSON.parse(savedAuth);
          if (parsedAuth.profile) {
            userId = parsedAuth.profile.id;
            token = parsedAuth.profile.token;
          }
        } catch (error) {
          // Handle parsing error silently
        }
      }
    }

    if (!userId) {
      throw new Error('User not authenticated');
    }

    if (!token) {
      throw new Error('No authentication token available');
    }

    // For now, using slot_id = 1 as default (you can modify this based on your slot system)
    const orderPayload = {
      user_id: userId,
      slot_id: orderData.selectedSlotId || 1, // Use selected slot ID or default to 1
      items: orderData.cart.map(item => ({
        productId: item.id || item.productId, // Use id if available, otherwise productId
        productName: item.name || item.productName,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.thumbnail || item.imgURL || item.images?.[0]?.img1
      }))
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch('http://localhost:8085/tricto/orders/addOrder', {
      method: 'POST',
      headers,
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // Handle specific error cases
      if (response.status === 403) {
        throw new Error('Authentication failed. Please login again.');
      } else if (response.status === 401) {
        throw new Error('Unauthorized. Please check your credentials.');
      }
      
      throw new Error(`Failed to place order: ${response.status} ${response.statusText}`);
    }

    const result = await response.text();
    
    // Add a small delay to ensure the order is processed
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return result;
  } catch (error) {
    throw error;
  }
});

// Get user orders
export const fetchUserOrders = createAsyncThunk('order/fetchUserOrders', async (_, { getState }) => {
  try {
    // Get authentication token from auth state
    const authState = getState().auth;
    let token = null;
    
    if (authState && authState.profile) {
      token = authState.profile.token;
    }

    // If no token in state, try localStorage
    if (!token) {
      const savedAuth = localStorage.getItem('authState');
      if (savedAuth) {
        try {
          const parsedAuth = JSON.parse(savedAuth);
          if (parsedAuth.profile) {
            token = parsedAuth.profile.token;
          }
        } catch (error) {
          console.log('Error parsing auth state:', error);
        }
      }
    }

    if (!token) {
      throw new Error('No authentication token available');
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch('http://localhost:8085/tricto/orders/getAllOrder', {
      headers,
    });
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Authentication failed. Please login again.');
      } else if (response.status === 401) {
        throw new Error('Unauthorized. Please check your credentials.');
      }
      throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
    }

    const orders = await response.json();
    console.log('User orders fetched:', orders);
    console.log('Orders structure:', orders.map(order => ({
      user_id: order.user_id,
      slot_id: order.slot_id,
      items_count: order.items ? order.items.length : 0,
      items: order.items
    })));
    return orders;
  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    throw error;
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    status: 'idle',
    error: null,
    lastOrderId: null,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearLastOrder: (state) => {
      state.lastOrderId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Place order
      .addCase(placeOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastOrderId = action.payload;
        state.error = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Fetch orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearOrderError, clearLastOrder } = orderSlice.actions;
export default orderSlice.reducer; 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch user orders
export const fetchUserOrders = createAsyncThunk('orders/fetchUserOrders', async (userId) => {
  const response = await fetch(`/api/orders?userId=${userId}`);
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
});

// Create new order
export const createOrder = createAsyncThunk('orders/createOrder', async (orderData) => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) throw new Error('Failed to create order');
  return response.json();
});

// Mock orders data for development
const mockOrders = [
  {
    id: 1,
    userId: 1,
    items: [
      { productId: 9, name: "Dolce Shine Eau de", price: 69.99, quantity: 1, imgURL: "https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/1.webp" }
      ],
    total: 69.99,
    status: 'delivered',
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-20',
    shippingAddress: '123 Main St, City, State 12345'
  },
  {
    id: 2,
    userId: 1,
    items: [
      { productId: 10, name: "Another Fragrance", price: 89.99, quantity: 2, imgURL: "https://cdn.dummyjson.com/product-images/fragrances/another-fragrance/1.webp" }
    ],
    total: 179.98,
    status: 'processing',
    orderDate: '2024-01-10',
    deliveryDate: null,
    shippingAddress: '123 Main St, City, State 12345'
  },
  {
    id: 3,
    userId: 1,
    items: [
      { productId: 11, name: "Premium Fragrance", price: 45.99, quantity: 1, imgURL: "https://cdn.dummyjson.com/product-images/fragrances/premium-fragrance/1.webp" },
      { productId: 12, name: "Luxury Fragrance", price: 55.99, quantity: 1, imgURL: "https://cdn.dummyjson.com/product-images/fragrances/luxury-fragrance/1.webp" }
    ],
    total: 101.98,
    status: 'shipped',
    orderDate: '2024-01-05',
    deliveryDate: '2024-01-12',
    shippingAddress: '123 Main St, City, State 12345'
  }
];

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: mockOrders, // Using mock data for development
    status: 'idle',
    error: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearOrders, updateOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer; 
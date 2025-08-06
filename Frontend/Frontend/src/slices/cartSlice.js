import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    isOrderInProgress: false,
    isLocked: false,
    globalLock: false,
  },
  reducers: {
    initializeCart: (state) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
      }
      state.items = [];
      state.isOrderInProgress = false;
      state.isLocked = false;
      state.globalLock = false;
    },
    lockCart: (state) => {
      state.isLocked = true;
      state.isOrderInProgress = true;
    },
    unlockCart: (state) => {
      state.isLocked = false;
      state.isOrderInProgress = false;
    },
    setGlobalLock: (state, action) => {
      state.globalLock = action.payload;
    },
    resetAllLocks: (state) => {
      state.isOrderInProgress = false;
      state.isLocked = false;
      state.globalLock = false;
    },
    addToCart: (state, action) => {
      if (state.isOrderInProgress || state.isLocked || state.globalLock) {
        return;
      }
      
      // Extract the product data without the inventory quantity
      const { quantity: inventoryQuantity, ...productData } = action.payload;
      
      const existing = state.items.find(item => item.id === productData.id);
      if (existing) {
        // If item exists, increment by 1 (or specified quantity)
        existing.quantity += action.payload.cartQuantity || 1;
      } else {
        // If new item, add with quantity 1 (or specified quantity)
        state.items.push({ 
          ...productData, 
          quantity: action.payload.cartQuantity || 1 
        });
      }
    },
    removeFromCart: (state, action) => {
      if (state.isOrderInProgress || state.isLocked || state.globalLock) {
        return;
      }
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      if (state.isOrderInProgress || state.isLocked || state.globalLock) {
        return;
      }
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) item.quantity = Math.max(1, quantity);
    },
    clearCart: (state) => {
      state.items = [];
    },
    forceClearCart: (state) => {
      state.items = [];
      state.isOrderInProgress = false;
      state.isLocked = false;
      state.globalLock = false;
    },
    setOrderInProgress: (state, action) => {
      state.isOrderInProgress = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setOrderInProgress, initializeCart, forceClearCart, lockCart, unlockCart, setGlobalLock, resetAllLocks } = cartSlice.actions;
export default cartSlice.reducer; 
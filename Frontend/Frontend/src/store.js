import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';
import slotsReducer from './slices/slotsSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
    order: orderReducer,
    slots: slotsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Subscribe to store changes and save auth state
store.subscribe(() => {
  const state = store.getState();
  if (state.auth) {
    localStorage.setItem('authState', JSON.stringify(state.auth));
  }
});

export { store };
export default store; 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Slots Management Slice
 * 
 * This Redux slice manages slot-related state for the e-commerce application.
 * Slots represent discount tiers for products with limited capacity.
 * 
 * Features:
 * - Fetch slots for specific products
 * - Fetch all slots in the system
 * - Reset pending slots
 * - Organize slots by product ID for efficient access
 * - Error handling and loading states
 */

/**
 * Fetch slots for a specific product
 * 
 * @param {string|number} productId - The ID of the product to fetch slots for
 * @returns {Promise<Array>} Array of slots for the product
 */
export const fetchProductSlots = createAsyncThunk('slots/fetchProductSlots', async (productId) => {
  try {
    const response = await fetch(`http://localhost:8085/tricto/slots/product/${productId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch slots: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch product slots from database');
  }
});

/**
 * Fetch all slots in the system
 * 
 * @returns {Promise<Array>} Array of all slots
 */
export const fetchAllSlots = createAsyncThunk('slots/fetchAllSlots', async () => {
  try {
    const response = await fetch('http://localhost:8085/tricto/slots', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch slots: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch slots from database');
  }
});

/**
 * Reset all pending slots to empty state
 * 
 * @param {Object} _ - Unused parameter (required by createAsyncThunk)
 * @param {Object} thunkAPI - Redux thunk API with getState function
 * @returns {Promise<Array>} Array of reset slots
 */
export const resetAllPendingSlots = createAsyncThunk('slots/resetAllPendingSlots', async (_, { getState }) => {
  try {
    const authState = getState().auth;
    const response = await fetch('http://localhost:8085/tricto/slots/reset-all-pending', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authState.profile?.token}`
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to reset pending slots: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to reset pending slots');
  }
});

/**
 * Slots Slice Configuration
 * 
 * Manages slot state with:
 * - Product-specific slot storage
 * - Loading and error states
 * - Async thunk handling for API calls
 */
const slotsSlice = createSlice({
  name: 'slots',
  initialState: {
    items: [], // All slots in the system
    productSlots: {}, // Slots organized by productId for efficient access
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    /**
     * Clear all slots from state
     */
    clearSlots: (state) => {
      state.items = [];
      state.productSlots = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchAllSlots async thunk
      .addCase(fetchAllSlots.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllSlots.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAllSlots.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Handle fetchProductSlots async thunk
      .addCase(fetchProductSlots.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductSlots.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Store slots by productId for easy access
        const productId = action.meta.arg; // The productId passed to the thunk
        state.productSlots[productId] = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProductSlots.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Handle resetAllPendingSlots async thunk
      .addCase(resetAllPendingSlots.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resetAllPendingSlots.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update the items array with the reset slots
        const resetSlots = Array.isArray(action.payload) ? action.payload : [];
        // Update existing slots with the reset data
        resetSlots.forEach(resetSlot => {
          const existingIndex = state.items.findIndex(slot => slot.slotId === resetSlot.slotId);
          if (existingIndex !== -1) {
            state.items[existingIndex] = resetSlot;
          }
        });
      })
      .addCase(resetAllPendingSlots.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearSlots } = slotsSlice.actions;
export default slotsSlice.reducer; 
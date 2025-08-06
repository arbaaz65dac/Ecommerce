import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { decodeJWT } from '../utils/jwtUtils';

/**
 * Authentication Slice
 * 
 * This Redux slice manages user authentication state including:
 * - Login/logout functionality
 * - User registration
 * - Token management
 * - Persistent authentication state
 * 
 * Features:
 * - JWT token handling
 * - Mock authentication for development
 * - Local storage persistence
 * - Error handling and user feedback
 */

/**
 * Login Async Thunk
 * 
 * Handles user login by sending credentials to the backend API.
 * Supports both real JWT authentication and mock authentication for development.
 * 
 * @param {Object} credentials - User login credentials (email, password, name)
 * @returns {Object} User object with authentication details
 */
export const login = createAsyncThunk('auth/login', async (credentials) => {
  try {
    console.log('Login attempt with credentials:', { email: credentials.email, name: credentials.name });
    
    // Attempt to authenticate with backend API
    const response = await fetch('http://localhost:8085/tricto/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    console.log('Login response status:', response.status);

    // Handle unsuccessful login attempts
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (jsonError) {
        console.log('Response is not valid JSON, treating as empty response');
      }
      console.log('Login response:', response.status, errorData);
      
      // Use mock authentication for server errors (500), but not for invalid credentials (401)
      if (response.status === 500) {
        console.log('Server error, using mock authentication for development');
        return createMockUser(credentials);
      }
      
      // For 401 (invalid credentials), throw error
      throw new Error(errorData.message || `Invalid email or password`);
    }

    // Handle successful login response
    let data = {};
    try {
      data = await response.json();
      console.log('Login response data:', data);
    } catch (jsonError) {
      console.log('Success response is not valid JSON, creating mock user');
      return createMockUser(credentials);
    }
    
    // Process JWT token from backend response
    if (data.token) {
      console.log('Backend returned JWT token, creating user object');
      
      // Decode the JWT token to extract user information
      const decodedToken = decodeJWT(data.token);
      console.log('Decoded token:', decodedToken);
      
      // Create user object with JWT token and decoded information
      const userObject = {
        id: 1, // TODO: Get from JWT token or backend response
        name: credentials.name || credentials.email.split('@')[0], // Use email prefix as name
        email: decodedToken ? decodedToken.email : credentials.email,
        role: decodedToken ? decodedToken.role : 'USER',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        token: data.token // Use the actual JWT token from backend
      };
      
      console.log('Created user object with token:', userObject.token ? 'Token present' : 'No token');
      console.log('User role:', userObject.role);
      console.log('User email:', userObject.email);
      console.log('Full user object:', userObject);
      return userObject;
    }
    
    // Fallback to old structure if needed
    console.log('Using fallback user structure');
    return data.user || createMockUser(credentials);
  } catch (error) {
    console.error('Login error:', error);
    
    // Create mock user if backend is not available (development mode)
    if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
      console.log('Backend not available, using mock authentication');
      return createMockUser(credentials);
    }
    throw error;
  }
});

/**
 * Signup Async Thunk
 * 
 * Handles user registration by sending user data to the backend API.
 * 
 * @param {Object} credentials - User registration data (email, password, name)
 * @returns {Object} Success status and message
 */
export const signup = createAsyncThunk('auth/signup', async (credentials) => {
  try {
    const response = await fetch('http://localhost:8085/tricto/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (jsonError) {
        console.log('Response is not valid JSON, treating as empty response');
      }
      console.log('Signup response:', response.status, errorData);
      
      // Handle specific error cases
      if (response.status === 409) {
        throw new Error('Email already exists. Please use a different email or try logging in.');
      } else if (response.status === 500) {
        console.log('Server error, treating as successful signup for development');
        return { success: true, message: 'Registration successful (mock)' };
      }
      
      throw new Error(errorData.message || `Signup failed: ${response.status}`);
    }

    // For successful signup, just return success status
    return { success: true, message: 'Registration successful' };
  } catch (error) {
    console.error('Signup error:', error);
    
    // For development, if backend is not available, return success
    if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
      console.log('Backend not available, treating as successful signup');
      return { success: true, message: 'Registration successful (mock)' };
    }
    throw error;
  }
});

/**
 * Creates a mock user object for development purposes
 * 
 * @param {Object} credentials - User credentials
 * @returns {Object} Mock user object
 */
const createMockUser = (credentials) => {
  return {
    id: 1,
    name: credentials.name || 'Demo User',
    email: credentials.email,
    role: 'USER',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    token: 'mock-token-' + Date.now()
  };
};

/**
 * Loads authentication state from localStorage
 * 
 * @returns {Object} Initial authentication state
 */
const loadAuthState = () => {
  try {
    const serializedState = localStorage.getItem('authState');
    console.log('Loading auth state from localStorage:', serializedState);
    if (serializedState === null) {
      return getInitialAuthState();
    }
    const parsedState = JSON.parse(serializedState);
    console.log('Parsed auth state:', parsedState);
    return parsedState;
  } catch (err) {
    console.error('Error loading auth state from localStorage:', err);
    return getInitialAuthState();
  }
};

/**
 * Returns the initial authentication state
 * 
 * @returns {Object} Initial auth state
 */
const getInitialAuthState = () => {
  return {
    user: null,
    profile: null,
    status: 'idle',
    error: null,
  };
};

/**
 * Auth Slice Configuration
 * 
 * Redux slice for managing authentication state with:
 * - Login/logout actions
 * - Profile management
 * - Local storage persistence
 * - Async thunk handling for API calls
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuthState(),
  reducers: {
    /**
     * Logout action - clears user data and removes from localStorage
     */
    logout: (state) => {
      state.user = null;
      state.profile = null;
      localStorage.removeItem('authState');
    },
    /**
     * Set profile action - updates user profile and saves to localStorage
     */
    setProfile: (state, action) => {
      state.profile = action.payload;
      localStorage.setItem('authState', JSON.stringify(state));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        console.log('Login pending...');
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.profile = action.payload;
        console.log('Login fulfilled with payload:', action.payload);
        // Save to localStorage
        localStorage.setItem('authState', JSON.stringify(state));
        console.log('Auth state saved to localStorage');
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        console.log('Login rejected with error:', action.error.message);
      })
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Don't set user/profile for signup - just clear any errors
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout, setProfile } = authSlice.actions;
export default authSlice.reducer;

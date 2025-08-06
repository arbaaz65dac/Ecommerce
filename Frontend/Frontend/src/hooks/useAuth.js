import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    // Check if user is logged in from localStorage on app startup
    const savedAuth = localStorage.getItem('authState');
    if (savedAuth && !auth.profile) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        if (parsedAuth.profile) {
          // User is logged in, restore the state
          console.log('Restoring authentication state from localStorage');
          // The authSlice should automatically load this on initialization
        }
      } catch (error) {
        console.error('Error parsing saved auth state:', error);
        localStorage.removeItem('authState');
      }
    }
  }, [auth.profile, dispatch]);

  return auth;
}; 
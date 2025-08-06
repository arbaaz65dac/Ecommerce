import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, setOrderInProgress, lockCart, unlockCart, forceClearCart, setGlobalLock } from '../slices/cartSlice';
import { placeOrder, clearOrderError } from '../slices/orderSlice';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../slices/cartSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector(state => state.cart.items);
  const authState = useSelector(state => state.auth);
  const orderState = useSelector(state => state.order);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    pincode: ''
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Function to save address to backend
  const saveAddress = async (addressData) => {
    try {
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

      const addressPayload = {
        addressLine: addressData.address,
        pincode: addressData.pincode,
        userId: authState.profile.id
      };

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch('http://localhost:8085/tricto/address', {
        method: 'POST',
        headers,
        body: JSON.stringify(addressPayload),
      });

      if (!response.ok) {
        console.error('Failed to save address:', response.status, response.statusText);
        // Don't throw error here as order should still be placed
        return null;
      }

      const savedAddress = await response.json();
      console.log('Address saved successfully:', savedAddress);
      return savedAddress;
    } catch (error) {
      console.error('Error saving address:', error);
      // Don't throw error here as order should still be placed
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    
    if (!authState.profile) {
      alert('Please login to place an order');
      navigate('/auth');
      setIsSubmitting(false);
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      setIsSubmitting(false);
      return;
    }

    dispatch(setOrderInProgress(true));
    dispatch(lockCart());
    dispatch(setGlobalLock(true));

    const orderCartData = [...cart];
    dispatch(clearCart());
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }

    try {
      // Save address to backend first
      await saveAddress(form);
      
      // Then place the order
      await dispatch(placeOrder({ 
        cart: orderCartData, 
        form,
        selectedSlotId: orderCartData[0]?.selectedSlotId || null
      })).unwrap();
      setSubmitted(true);
      setTimeout(() => navigate('/shop'), 3000);
    } catch (error) {
      alert(`Order placement failed: ${error.message}`);
      
      orderCartData.forEach(item => {
        // Extract cart quantity and ignore inventory quantity
        const { quantity: inventoryQuantity, ...productData } = item;
        dispatch(addToCart({
          ...productData,
          cartQuantity: item.quantity // Use the cart quantity that was saved
        }));
      });
    } finally {
      dispatch(unlockCart());
      dispatch(setGlobalLock(false));
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className='max-container min-h-screen flex flex-col items-center justify-center'>
        <h1 className='text-3xl font-bold mb-4'>Thank you for your order!</h1>
        <p className='text-lg text-gray-500'>Your order has been placed successfully.</p>
        <p className='text-lg text-gray-500'>Your address has been saved for future orders.</p>
        <p className='text-lg text-gray-500'>You will be redirected to the shop shortly.</p>
      </section>
    );
  }

  if (orderState.status === 'loading') {
    return (
      <section className='max-container min-h-screen flex flex-col items-center justify-center'>
        <h1 className='text-3xl font-bold mb-4'>Processing your order...</h1>
        <div className='mt-4'>
          <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coral-red'></div>
        </div>
      </section>
    );
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <section className='max-container min-h-screen py-8 mt-24'>
      <h1 className='text-4xl font-bold mb-6'>Checkout</h1>
      <form onSubmit={handleSubmit} className='max-w-lg mx-auto flex flex-col gap-4'>
        <input
          type='text'
          name='name'
          placeholder='Full Name'
          value={form.name}
          onChange={handleChange}
          required
          className='border p-2 rounded'
        />
        <input
          type='email'
          name='email'
          placeholder='Email Address'
          value={form.email}
          onChange={handleChange}
          required
          className='border p-2 rounded'
        />
        <textarea
          name='address'
          placeholder='Shipping Address (Street, City, State)'
          value={form.address}
          onChange={handleChange}
          required
          className='border p-2 rounded'
          rows={3}
        />
        <input
          type='text'
          name='pincode'
          placeholder='Pincode'
          value={form.pincode}
          onChange={handleChange}
          required
          pattern='[0-9]{6}'
          title='Please enter a valid 6-digit pincode'
          className='border p-2 rounded'
        />
        <div className='bg-gray-100 p-4 rounded mt-4'>
          <h2 className='text-xl font-semibold mb-2'>Order Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className='flex justify-between mb-1'>
              <span>{item.name} x {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className='flex justify-between font-bold mt-2'>
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
        {orderState.error && (
          <div className='text-red-600 text-center mt-2'>
            {orderState.error}
          </div>
        )}
        <button 
          type='submit' 
          className='bg-coral-red text-white px-6 py-2 rounded-full font-semibold mt-4'
          disabled={orderState.status === 'loading' || isSubmitting}
        >
          {orderState.status === 'loading' || isSubmitting ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </section>
  );
};

export default Checkout; 
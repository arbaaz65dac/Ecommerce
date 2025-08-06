import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const cart = useSelector(state => state.cart?.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className='max-container min-h-screen py-8 mt-24'>
      <h1 className='text-4xl font-bold mb-6'>Your Cart</h1>
      {cart.length === 0 ? (
        <div>
          <p className='text-lg text-gray-500 mb-4'>Your cart is empty.</p>
          <Link to='/shop' className='text-coral-red underline'>Go to Shop</Link>
        </div>
      ) : (
        <>
          <div className='flex flex-col gap-6 mb-8'>
            {cart.map((item) => (
              <div key={item.id} className='flex items-center gap-6 border-b pb-4'>
                <img src={item.thumbnail || item.imgURL || '/fallback-image.jpg'} alt={item.name || item.title} className='w-24 h-24 object-cover rounded' />
                <div className='flex-1'>
                  <h2 className='text-xl font-semibold'>{item.name}</h2>
                  <p className='text-gray-500'>₹{item.price}</p>
                  <div className='flex items-center gap-2 mt-2'>
                    <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))} className='px-2 py-1 border rounded'>-</button>
                    <span className='px-2'>{item.quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))} className='px-2 py-1 border rounded'>+</button>
                  </div>
                </div>
                <button onClick={() => dispatch(removeFromCart(item.id))} className='text-red-500 underline'>Remove</button>
              </div>
            ))}
          </div>
          <div className='flex justify-between items-center mt-8'>
            <button onClick={() => dispatch(clearCart())} className='text-gray-500 underline'>Clear Cart</button>
            <div className='text-2xl font-bold'>Total: ₹{total.toFixed(2)}</div>
            <button onClick={() => navigate('/checkout')} className='bg-coral-red text-white px-6 py-2 rounded-full font-semibold'>Proceed to Checkout</button>
          </div>
        </>
      )}
    </section>
  );
};

export default Cart; 
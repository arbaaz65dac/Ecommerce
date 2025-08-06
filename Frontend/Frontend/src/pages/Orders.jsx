import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserOrders } from '../slices/orderSlice';
import { Link } from 'react-router-dom';

const Orders = () => {
  const orders = useSelector(state => state.order?.orders || []);
  const orderStatus = useSelector(state => state.order?.status);
  const profile = useSelector(state => state.auth.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    if (profile) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, profile]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'processing':
        return 'Processing';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateOrderTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (orderStatus === 'loading') {
    return (
      <section className='max-container min-h-screen flex flex-col items-center justify-center'>
        <h1 className='text-3xl font-bold mb-4'>Loading your orders...</h1>
        <div className='mt-4'>
          <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coral-red'></div>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <div className="padding-x py-10">
        <div className="max-container">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please sign in to view your orders</h2>
            <Link to="/auth" className="text-coral-red hover:underline">
              Sign in to continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="padding-x py-10">
      <div className="max-container">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        
        {orderStatus === 'loading' ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-semibold mb-4">Loading orders...</h3>
            <div className='mt-4'>
              <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coral-red'></div>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-semibold mb-4">No orders yet</h3>
            <p className="text-slate-gray mb-6">Start shopping to see your orders here</p>
            <Link 
              to="/shop" 
              className="inline-block bg-coral-red text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{index + 1}</h3>
                    <p className="text-slate-gray text-sm">
                      User ID: {order.user_id} | Slot ID: {order.slot_id}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Order Placed
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                  <div className="border-t pt-4 mb-4">
                    <h5 className="font-semibold mb-3">Order Items:</h5>
                    <div className="space-y-3">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <img 
                            src={item.imageUrl || '/fallback-image.jpg'} 
                            alt={item.productName || 'Product'}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              e.target.src = '/fallback-image.jpg';
                            }}
                          />
                          <div className="flex-1">
                            <h6 className="font-semibold text-lg">{item.productName || 'Unknown Product'}</h6>
                            <p className="text-slate-gray">Quantity: {item.quantity || 1}</p>
                            <p className="text-coral-red font-semibold">₹{item.price || 0}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Order Total */}
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-xl font-bold text-coral-red">
                          ₹{calculateOrderTotal(order.items).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-t pt-4 mb-4">
                    <p className="text-slate-gray">
                      {!order.items ? 'No items information available for this order' : 
                       Array.isArray(order.items) && order.items.length === 0 ? 'No items in this order' :
                       'Invalid items data for this order'}
                    </p>
                  </div>
                )}

                {/* Order Details */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-semibold mb-2">Order Information:</h5>
                      <p className="text-slate-gray">User ID: {order.user_id}</p>
                      <p className="text-slate-gray">Slot ID: {order.slot_id}</p>
                      <p className="text-slate-gray">Items: {order.items ? order.items.length : 0}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Order Status:</h5>
                      <p className="text-slate-gray">Order has been placed successfully</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex gap-3">
                    <button className="text-coral-red hover:underline text-sm">
                      Track Order
                    </button>
                    <button className="text-coral-red hover:underline text-sm">
                      Download Invoice
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 
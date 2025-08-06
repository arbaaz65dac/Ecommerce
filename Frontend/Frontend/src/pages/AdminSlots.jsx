import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const AdminSlots = () => {
  const [slots, setSlots] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [nearFullSlots, setNearFullSlots] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' }); // 'success' or 'error'
  const [formData, setFormData] = useState({
    productId: '',
    maxSlotSize: '',
    currentSlotSize: '',
    discountPercentage: '',
    isFull: false
  });

  const authState = useSelector(state => state.auth);

  useEffect(() => {
    fetchSlots();
    fetchProducts();
    fetchNearFullSlots();
  }, []);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8085/tricto/slots', {
        headers: {
          'Authorization': `Bearer ${authState.profile?.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSlots(data);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearFullSlots = async () => {
    try {
      const response = await fetch('http://localhost:8085/tricto/slots/near-full', {
        headers: {
          'Authorization': `Bearer ${authState.profile?.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNearFullSlots(data);
      }
    } catch (error) {
      console.error('Error fetching near-full slots:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8085/tricto/products', {
        headers: {
          'Authorization': `Bearer ${authState.profile?.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleResetSlot = async (slotId) => {
    if (window.confirm('Are you sure you want to reset this slot? This will set the current size to 0.')) {
      try {
        const response = await fetch(`http://localhost:8085/tricto/slots/${slotId}/reset`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authState.profile?.token}`
          }
        });
        
        if (response.ok) {
          fetchSlots();
          fetchNearFullSlots();
          setMessage({ text: '✅ Slot reset successfully!', type: 'success' });
          setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } else {
          setMessage({ text: '❌ Failed to reset slot. Please try again.', type: 'error' });
          setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        }
      } catch (error) {
        console.error('Error resetting slot:', error);
        setMessage({ text: `❌ Error resetting slot: ${error.message}`, type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      }
    }
  };

  const handleResetAllPendingSlots = async () => {
    const fullSlots = slots.filter(slot => slot.isFull);
    
    if (fullSlots.length === 0) {
      alert('No full slots to reset!');
      return;
    }

    if (window.confirm(`Are you sure you want to reset all ${fullSlots.length} full slots? This will set their current size to 0 and mark them as not full.`)) {
      try {
        const response = await fetch('http://localhost:8085/tricto/slots/reset-all-pending', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authState.profile?.token}`
          }
        });
        
        if (response.ok) {
          fetchSlots();
          fetchNearFullSlots();
          setMessage({ text: `✅ Successfully reset ${fullSlots.length} full slots!`, type: 'success' });
          setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } else {
          setMessage({ text: '❌ Error resetting full slots. Please try again.', type: 'error' });
          setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        }
      } catch (error) {
        console.error('Error resetting all full slots:', error);
        setMessage({ text: `❌ Error resetting full slots: ${error.message}`, type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      }
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8085/tricto/slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.profile?.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setShowAddModal(false);
        setFormData({
          productId: '',
          maxSlotSize: '',
          currentSlotSize: '',
          discountPercentage: '',
          isFull: false
        });
        fetchSlots();
        fetchNearFullSlots();
        setMessage({ text: '✅ Slot added successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        setMessage({ text: '❌ Failed to add slot. Please try again.', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      }
    } catch (error) {
      console.error('Error adding slot:', error);
      setMessage({ text: `❌ Error adding slot: ${error.message}`, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  const handleEditSlot = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8085/tricto/slots/${selectedSlot.slotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.profile?.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setShowEditModal(false);
        setSelectedSlot(null);
        setFormData({
          productId: '',
          maxSlotSize: '',
          currentSlotSize: '',
          discountPercentage: '',
          isFull: false
        });
        fetchSlots();
        fetchNearFullSlots();
        setMessage({ text: '✅ Slot updated successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        setMessage({ text: '❌ Failed to update slot. Please try again.', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      }
    } catch (error) {
      console.error('Error updating slot:', error);
      setMessage({ text: `❌ Error updating slot: ${error.message}`, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      try {
        const response = await fetch(`http://localhost:8085/tricto/slots/${slotId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authState.profile?.token}`
          }
        });
        
        if (response.ok) {
          fetchSlots();
          fetchNearFullSlots();
          setMessage({ text: '✅ Slot deleted successfully!', type: 'success' });
          setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } else {
          setMessage({ text: '❌ Failed to delete slot. Please try again.', type: 'error' });
          setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        }
      } catch (error) {
        console.error('Error deleting slot:', error);
        setMessage({ text: `❌ Error deleting slot: ${error.message}`, type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      }
    }
  };

  const openEditModal = (slot) => {
    setSelectedSlot(slot);
    setFormData({
      productId: slot.product?.productId || slot.productId,
      maxSlotSize: slot.maxSlotSize,
      currentSlotSize: slot.currentSlotSize,
      discountPercentage: slot.discountPercentage,
      isFull: slot.isFull
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      maxSlotSize: '',
      currentSlotSize: '',
      discountPercentage: '',
      isFull: false
    });
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.productId === productId);
    return product ? product.productName : 'Unknown Product';
  };

  const getProgressPercentage = (current, max) => {
    return Math.min((current / max) * 100, 100);
  };

  const getProgressColor = (percentage, isFull, isNearFull) => {
    if (isFull) return 'bg-red-500';
    if (isNearFull) return 'bg-orange-500';
    if (percentage <= 25) return 'bg-red-500';
    if (percentage <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const isNearFull = (slot) => {
    return !slot.isFull && slot.currentSlotSize >= (slot.maxSlotSize - 5);
  };

  const getSlotStatus = (slot) => {
    if (slot.isFull) return { text: 'FULL', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (isNearFull(slot)) return { text: 'NEAR FULL', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { text: 'Active', color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  return (
    <div className="p-6">
      {/* Near Full Slots Notification */}
      {nearFullSlots.length > 0 && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">
                {nearFullSlots.length} slot{nearFullSlots.length > 1 ? 's' : ''} near full capacity
              </h3>
              <div className="mt-2 text-sm text-orange-700">
                <p>These slots are within 5 items of their maximum capacity and may need to be reset soon.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Slots Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={handleResetAllPendingSlots}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            🔄 Reset All Full Slots
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-coral-red text-white px-4 py-2 rounded-lg hover:bg-coral-red/80 transition-colors"
          >
            ➕ Add Slot
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-red"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot) => {
            const progressPercentage = getProgressPercentage(slot.currentSlotSize, slot.maxSlotSize);
            const nearFull = isNearFull(slot);
            const progressColor = getProgressColor(progressPercentage, slot.isFull, nearFull);
            const status = getSlotStatus(slot);
            
            return (
              <div key={slot.slotId} className={`bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${
                slot.isFull ? 'border-red-200 bg-red-50' : 
                nearFull ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getProductName(slot.product?.productId || slot.productId)}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {slot.discountPercentage}% Discount
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(slot)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSlot(slot.slotId)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-medium">
                      {slot.currentSlotSize.toLocaleString()} / {slot.maxSlotSize.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${progressColor}`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">ID: {slot.slotId}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color} ${status.bgColor}`}>
                      {status.text}
                    </span>
                  </div>

                  {/* Reset Button for Near Full or Full Slots */}
                  {(slot.isFull || nearFull) && (
                    <button
                      onClick={() => handleResetSlot(slot.slotId)}
                      className="w-full mt-3 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      🔄 Reset Slot
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Slot</h3>
              <form onSubmit={handleAddSlot}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product</label>
                    <select
                      value={formData.productId}
                      onChange={(e) => setFormData({...formData, productId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.productId} value={product.productId}>
                          {product.productName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Slot Size</label>
                    <input
                      type="number"
                      value={formData.maxSlotSize}
                      onChange={(e) => setFormData({...formData, maxSlotSize: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Slot Size</label>
                    <input
                      type="number"
                      value={formData.currentSlotSize}
                      onChange={(e) => setFormData({...formData, currentSlotSize: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
                    <input
                      type="number"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFull"
                      checked={formData.isFull}
                      onChange={(e) => setFormData({...formData, isFull: e.target.checked})}
                      className="h-4 w-4 text-coral-red focus:ring-coral-red border-gray-300 rounded"
                    />
                    <label htmlFor="isFull" className="ml-2 block text-sm text-gray-900">
                      Slot is Full
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-coral-red rounded-md hover:bg-coral-red/80"
                  >
                    Add Slot
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Slot Modal */}
      {showEditModal && selectedSlot && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Slot</h3>
              <form onSubmit={handleEditSlot}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product</label>
                    <select
                      value={formData.productId}
                      onChange={(e) => setFormData({...formData, productId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.productId} value={product.productId}>
                          {product.productName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Slot Size</label>
                    <input
                      type="number"
                      value={formData.maxSlotSize}
                      onChange={(e) => setFormData({...formData, maxSlotSize: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Slot Size</label>
                    <input
                      type="number"
                      value={formData.currentSlotSize}
                      onChange={(e) => setFormData({...formData, currentSlotSize: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
                    <input
                      type="number"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFullEdit"
                      checked={formData.isFull}
                      onChange={(e) => setFormData({...formData, isFull: e.target.checked})}
                      className="h-4 w-4 text-coral-red focus:ring-coral-red border-gray-300 rounded"
                    />
                    <label htmlFor="isFullEdit" className="ml-2 block text-sm text-gray-900">
                      Slot is Full
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedSlot(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-coral-red rounded-md hover:bg-coral-red/80"
                  >
                    Update Slot
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSlots; 
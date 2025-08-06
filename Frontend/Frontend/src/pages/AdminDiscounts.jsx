import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const AdminDiscounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [formData, setFormData] = useState({
    productId: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
    isActive: true,
    description: ''
  });

  const authState = useSelector(state => state.auth);

  useEffect(() => {
    fetchDiscounts();
    fetchProducts();
  }, []);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      // This would be replaced with actual discount API endpoint
      // For now, we'll use slots as discounts since they contain discount information
      const response = await fetch('http://localhost:8085/tricto/slots', {
        headers: {
          'Authorization': `Bearer ${authState.profile?.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Transform slots data to discount format
        const discountData = data.map(slot => ({
          id: slot.slotId,
          productId: slot.product?.productId || slot.productId,
          discountPercentage: slot.discountPercentage,
          startDate: new Date().toISOString().split('T')[0], // Default to today
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 30 days from now
          isActive: !slot.isFull,
          description: `${slot.discountPercentage}% discount for ${slot.maxSlotSize} people`,
          currentUsage: slot.currentSlotSize,
          maxUsage: slot.maxSlotSize
        }));
        setDiscounts(discountData);
      }
    } catch (error) {
      console.error('Error fetching discounts:', error);
    } finally {
      setLoading(false);
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

  const handleAddDiscount = async (e) => {
    e.preventDefault();
    try {
      // This would be replaced with actual discount API endpoint
      // For now, we'll create a slot as a discount
      const slotData = {
        productId: formData.productId,
        maxSlotSize: 1000, // Default max size
        currentSlotSize: 0,
        discountPercentage: formData.discountPercentage,
        isFull: false
      };

      const response = await fetch('http://localhost:8085/tricto/slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.profile?.token}`
        },
        body: JSON.stringify(slotData)
      });
      
      if (response.ok) {
        setShowAddModal(false);
        setFormData({
          productId: '',
          discountPercentage: '',
          startDate: '',
          endDate: '',
          isActive: true,
          description: ''
        });
        fetchDiscounts();
      }
    } catch (error) {
      console.error('Error adding discount:', error);
    }
  };

  const handleEditDiscount = async (e) => {
    e.preventDefault();
    try {
      // This would be replaced with actual discount API endpoint
      const slotData = {
        productId: formData.productId,
        maxSlotSize: selectedDiscount.maxUsage,
        currentSlotSize: selectedDiscount.currentUsage,
        discountPercentage: formData.discountPercentage,
        isFull: !formData.isActive
      };

      const response = await fetch(`http://localhost:8085/tricto/slots/${selectedDiscount.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.profile?.token}`
        },
        body: JSON.stringify(slotData)
      });
      
      if (response.ok) {
        setShowEditModal(false);
        setSelectedDiscount(null);
        setFormData({
          productId: '',
          discountPercentage: '',
          startDate: '',
          endDate: '',
          isActive: true,
          description: ''
        });
        fetchDiscounts();
      }
    } catch (error) {
      console.error('Error updating discount:', error);
    }
  };

  const handleDeleteDiscount = async (discountId) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      try {
        const response = await fetch(`http://localhost:8085/tricto/slots/${discountId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authState.profile?.token}`
          }
        });
        
        if (response.ok) {
          fetchDiscounts();
        }
      } catch (error) {
        console.error('Error deleting discount:', error);
      }
    }
  };

  const openEditModal = (discount) => {
    setSelectedDiscount(discount);
    setFormData({
      productId: discount.productId,
      discountPercentage: discount.discountPercentage,
      startDate: discount.startDate,
      endDate: discount.endDate,
      isActive: discount.isActive,
      description: discount.description
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      discountPercentage: '',
      startDate: '',
      endDate: '',
      isActive: true,
      description: ''
    });
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.productId === productId);
    return product ? product.productName : 'Unknown Product';
  };

  const getUsagePercentage = (current, max) => {
    return Math.min((current / max) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage <= 25) return 'bg-green-500';
    if (percentage <= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Discounts Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-coral-red text-white px-4 py-2 rounded-lg hover:bg-coral-red/80 transition-colors"
        >
          ➕ Add Discount
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-red"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discounts.map((discount) => {
            const usagePercentage = getUsagePercentage(discount.currentUsage, discount.maxUsage);
            const usageColor = getUsageColor(usagePercentage);
            
            return (
              <div key={discount.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getProductName(discount.productId)}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {discount.discountPercentage}% Off
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(discount)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDiscount(discount.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    {discount.description}
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Usage:</span>
                    <span className="font-medium">
                      {discount.currentUsage.toLocaleString()} / {discount.maxUsage.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${usageColor}`}
                      style={{ width: `${usagePercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>ID: {discount.id}</span>
                    <span className={discount.isActive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {discount.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <div>Start: {discount.startDate}</div>
                    <div>End: {discount.endDate}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Discount Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Discount</h3>
              <form onSubmit={handleAddDiscount}>
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
                    <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
                    <input
                      type="number"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                      min="1"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      rows="3"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="h-4 w-4 text-coral-red focus:ring-coral-red border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Discount is Active
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
                    Add Discount
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Discount Modal */}
      {showEditModal && selectedDiscount && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Discount</h3>
              <form onSubmit={handleEditDiscount}>
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
                    <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
                    <input
                      type="number"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                      min="1"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      rows="3"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActiveEdit"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="h-4 w-4 text-coral-red focus:ring-coral-red border-gray-300 rounded"
                    />
                    <label htmlFor="isActiveEdit" className="ml-2 block text-sm text-gray-900">
                      Discount is Active
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedDiscount(null);
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
                    Update Discount
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

export default AdminDiscounts; 
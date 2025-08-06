import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' }); // 'success' or 'error'
  const [formData, setFormData] = useState({
    categoryName: '',
    categoryDescription: '',
    categoryUrl: ''
  });

  const authState = useSelector(state => state.auth);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8085/tricto/categories', {
        headers: {
          'Authorization': `Bearer ${authState.profile?.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8085/tricto/categories', {
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
          categoryName: '',
          categoryDescription: '',
          categoryUrl: ''
        });
        fetchCategories();
        setMessage({ text: '✅ Category added successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        setMessage({ text: '❌ Failed to add category. Please try again.', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setMessage({ text: `❌ Error adding category: ${error.message}`, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8085/tricto/categories/${selectedCategory.categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.profile?.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setShowEditModal(false);
        setSelectedCategory(null);
        setFormData({
          categoryName: '',
          categoryDescription: '',
          categoryUrl: ''
        });
        fetchCategories();
        setMessage({ text: '✅ Category updated successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        setMessage({ text: '❌ Failed to update category. Please try again.', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setMessage({ text: `❌ Error updating category: ${error.message}`, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This will also affect all products in this category.')) {
      try {
        const response = await fetch(`http://localhost:8085/tricto/categories/${categoryId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authState.profile?.token}`
          }
        });
        
        if (response.ok) {
          fetchCategories();
          setMessage({ text: '✅ Category deleted successfully!', type: 'success' });
          setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } else {
          setMessage({ text: '❌ Failed to delete category. Please try again.', type: 'error' });
          setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        setMessage({ text: `❌ Error deleting category: ${error.message}`, type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      }
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      categoryName: category.categoryName,
      categoryDescription: category.categoryDescription || '',
      categoryUrl: category.categoryUrl || ''
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      categoryName: '',
      categoryDescription: '',
      categoryUrl: ''
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Categories Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-coral-red text-white px-4 py-2 rounded-lg hover:bg-coral-red/80 transition-colors"
        >
          ➕ Add Category
        </button>
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
          {categories.map((category) => (
            <div key={category.categoryId} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.categoryName}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {category.categoryDescription || 'No description available'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(category)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.categoryId)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>ID: {category.categoryId}</span>
                {category.categoryUrl && (
                  <a
                    href={category.categoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-coral-red hover:text-coral-red/80"
                  >
                    View URL
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Category</h3>
              <form onSubmit={handleAddCategory}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category Name</label>
                    <input
                      type="text"
                      value={formData.categoryName}
                      onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={formData.categoryDescription}
                      onChange={(e) => setFormData({...formData, categoryDescription: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category URL (Optional)</label>
                    <input
                      type="url"
                      value={formData.categoryUrl}
                      onChange={(e) => setFormData({...formData, categoryUrl: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      placeholder="https://example.com"
                    />
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
                    Add Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Category</h3>
              <form onSubmit={handleEditCategory}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category Name</label>
                    <input
                      type="text"
                      value={formData.categoryName}
                      onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={formData.categoryDescription}
                      onChange={(e) => setFormData({...formData, categoryDescription: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category URL (Optional)</label>
                    <input
                      type="url"
                      value={formData.categoryUrl}
                      onChange={(e) => setFormData({...formData, categoryUrl: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedCategory(null);
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
                    Update Category
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

export default AdminCategories; 
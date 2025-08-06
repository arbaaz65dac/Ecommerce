import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

/**
 * AdminProducts Component
 * 
 * This component provides an admin interface for managing products including:
 * - Adding new products with multiple slot configurations
 * - Editing existing products and their slots
 * - Deleting products
 * - Viewing all products in a table format
 * 
 * Features:
 * - Supports up to 3 discount slots per product
 * - Image management (up to 3 images per product)
 * - Category assignment
 * - Real-time validation and error handling
 */
const AdminProducts = () => {
  // State for managing products and categories
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal state management
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // User feedback state
  const [message, setMessage] = useState({ text: '', type: '' }); // 'success' or 'error'
  
  // Form data state - includes product details and slot configurations
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    categoryId: '',
    quantity: '',
    images: [],
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
    // Multiple slots configuration - supports up to 3 discount tiers
    slots: [
      {
        maxSlotSize: '',
        currentSlotSize: '',
        discountPercentage: '',
        isFull: false
      },
      {
        maxSlotSize: '',
        currentSlotSize: '',
        discountPercentage: '',
        isFull: false
      },
      {
        maxSlotSize: '',
        currentSlotSize: '',
        discountPercentage: '',
        isFull: false
      }
    ]
  });

  // Get authentication state from Redux
  const authState = useSelector(state => state.auth);

  // Initialize data on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  /**
   * Fetches all products from the backend API
   * Updates the products state with the fetched data
   */
  const fetchProducts = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches all categories from the backend API
   * Updates the categories state with the fetched data
   */
  const fetchCategories = async () => {
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
    }
  };

  /**
   * Handles the submission of the add product form
   * Creates a new product and associated slots if configured
   */
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    // Validate that at least one image URL is provided
    if (!formData.imageUrl1 && !formData.imageUrl2 && !formData.imageUrl3) {
      alert('Please provide at least one image URL.');
      return;
    }

    try {
      // Prepare image data - only include non-empty URLs
      let images = [];
      if (formData.imageUrl1 || formData.imageUrl2 || formData.imageUrl3) {
        const imageData = {
          img1: formData.imageUrl1 || formData.imageUrl2 || formData.imageUrl3 || '', // Use first available URL as img1
          img2: formData.imageUrl2 || '',
          img3: formData.imageUrl3 || ''
        };
        images = [imageData];
      }

      const productData = {
        productName: formData.productName,
        categoryId: parseInt(formData.categoryId),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        images: images
      };

      console.log('Sending product data:', productData);

      const response = await fetch('http://localhost:8085/tricto/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.profile?.token}`
        },
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
        const newProduct = await response.json();
        
        // Create multiple slots if slot data is provided
        const validSlots = formData.slots.filter(slot => 
          slot.maxSlotSize && slot.discountPercentage
        );

        if (validSlots.length > 0) {
          let slotsCreated = 0;
          let slotsFailed = 0;

          for (const slot of validSlots) {
            const slotData = {
              productId: newProduct.productId,
              maxSlotSize: parseInt(slot.maxSlotSize),
              currentSlotSize: parseInt(slot.currentSlotSize) || 0,
              discountPercentage: parseFloat(slot.discountPercentage),
              isFull: slot.isFull
            };

            console.log('Creating slot with data:', slotData);

            const slotResponse = await fetch('http://localhost:8085/tricto/slots', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authState.profile?.token}`
              },
              body: JSON.stringify(slotData)
            });

            if (slotResponse.ok) {
              slotsCreated++;
            } else {
              slotsFailed++;
            }
          }

          if (slotsFailed === 0) {
            setMessage({ text: `✅ Product and ${slotsCreated} slot(s) added successfully!`, type: 'success' });
          } else {
            setMessage({ text: `✅ Product added successfully! ${slotsCreated} slot(s) created, ${slotsFailed} failed.`, type: 'success' });
          }
        } else {
          setMessage({ text: '✅ Product added successfully!', type: 'success' });
        }

        setShowAddModal(false);
        setFormData({
          productName: '',
          description: '',
          price: '',
          categoryId: '',
          quantity: '',
          images: [],
          imageUrl1: '',
          imageUrl2: '',
          imageUrl3: '',
          maxSlotSize: '',
          currentSlotSize: '',
          discountPercentage: '',
          isFull: false
        });
        fetchProducts();
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        setMessage({ text: '❌ Failed to add product. Please try again.', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage({ text: `❌ Error adding product: ${error.message}`, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  /**
   * Handles the submission of the edit product form
   * Updates an existing product and its associated slots
   */
  const handleEditProduct = async (e) => {
    e.preventDefault();
    
    // Validate that at least one image URL is provided
    if (!formData.imageUrl1 && !formData.imageUrl2 && !formData.imageUrl3) {
      alert('Please provide at least one image URL.');
      return;
    }

    try {
      // Only include images if at least one URL is provided
      let images = [];
      if (formData.imageUrl1 || formData.imageUrl2 || formData.imageUrl3) {
        const imageData = {
          img1: formData.imageUrl1 || formData.imageUrl2 || formData.imageUrl3 || '', // Use first available URL as img1
          img2: formData.imageUrl2 || '',
          img3: formData.imageUrl3 || ''
        };
        images = [imageData];
      }

      const productData = {
        productName: formData.productName,
        categoryId: parseInt(formData.categoryId),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        images: images
      };

      console.log('Sending update data:', productData);

      const response = await fetch(`http://localhost:8085/tricto/products/${selectedProduct.productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.profile?.token}`
        },
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
        // Handle multiple slot creation/update if slot data is provided
        const validSlots = formData.slots.filter(slot => 
          slot.maxSlotSize && slot.discountPercentage
        );

        if (validSlots.length > 0) {
          // First, get existing slots for this product
          const existingSlotsResponse = await fetch(`http://localhost:8085/tricto/slots/product/${selectedProduct.productId}`, {
            headers: {
              'Authorization': `Bearer ${authState.profile?.token}`
            }
          });

          if (existingSlotsResponse.ok) {
            const existingSlots = await existingSlotsResponse.json();
            let slotsUpdated = 0;
            let slotsCreated = 0;
            let slotsFailed = 0;

            // Process each valid slot
            for (let i = 0; i < validSlots.length; i++) {
              const slot = validSlots[i];
              const slotData = {
                productId: selectedProduct.productId,
                maxSlotSize: parseInt(slot.maxSlotSize),
                currentSlotSize: parseInt(slot.currentSlotSize) || 0,
                discountPercentage: parseFloat(slot.discountPercentage),
                isFull: slot.isFull
              };

              console.log(`Creating/updating slot ${i + 1} with data:`, slotData);

              if (i < existingSlots.length) {
                // Update existing slot
                const slotId = existingSlots[i].slotId;
                const slotResponse = await fetch(`http://localhost:8085/tricto/slots/${slotId}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authState.profile?.token}`
                  },
                  body: JSON.stringify(slotData)
                });

                if (slotResponse.ok) {
                  slotsUpdated++;
                } else {
                  slotsFailed++;
                }
              } else {
                // Create new slot
                const slotResponse = await fetch('http://localhost:8085/tricto/slots', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authState.profile?.token}`
                  },
                  body: JSON.stringify(slotData)
                });

                if (slotResponse.ok) {
                  slotsCreated++;
                } else {
                  slotsFailed++;
                }
              }
            }

            if (slotsFailed === 0) {
              setMessage({ text: `✅ Product updated successfully! ${slotsUpdated} slot(s) updated, ${slotsCreated} slot(s) created.`, type: 'success' });
            } else {
              setMessage({ text: `✅ Product updated successfully! ${slotsUpdated} slot(s) updated, ${slotsCreated} slot(s) created, ${slotsFailed} failed.`, type: 'success' });
            }
          } else {
            setMessage({ text: '✅ Product updated successfully, but slot operation failed.', type: 'success' });
          }
        } else {
          setMessage({ text: '✅ Product updated successfully!', type: 'success' });
        }

        setShowEditModal(false);
        setSelectedProduct(null);
        setFormData({
          productName: '',
          description: '',
          price: '',
          categoryId: '',
          quantity: '',
          images: [],
          imageUrl1: '',
          imageUrl2: '',
          imageUrl3: '',
          maxSlotSize: '',
          currentSlotSize: '',
          discountPercentage: '',
          isFull: false
        });
        fetchProducts();
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        setMessage({ text: '❌ Failed to update product. Please try again.', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage({ text: `❌ Error updating product: ${error.message}`, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  /**
   * Deletes a product from the system
   * Shows confirmation dialog before deletion
   */
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:8085/tricto/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authState.profile?.token}`
          }
        });
        
        if (response.ok) {
          fetchProducts();
          setMessage({ text: '✅ Product deleted successfully!', type: 'success' });
          setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } else {
          setMessage({ text: '❌ Failed to delete product. Please try again.', type: 'error' });
          setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        setMessage({ text: `❌ Error deleting product: ${error.message}`, type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      }
    }
  };

  /**
   * Opens the edit modal and populates it with existing product data
   * Fetches and loads existing slot configurations for the product
   */
  const openEditModal = async (product) => {
    setSelectedProduct(product);
    
    // Set basic product data
    const formDataToSet = {
      productName: product.productName,
      description: product.description || '',
      price: product.price,
      categoryId: product.categoryId || '',
      quantity: product.quantity,
      images: product.images || [],
      imageUrl1: product.images?.[0]?.img1 || '',
      imageUrl2: product.images?.[1]?.img2 || '',
      imageUrl3: product.images?.[2]?.img3 || '',
      slots: [
        {
          maxSlotSize: '',
          currentSlotSize: '',
          discountPercentage: '',
          isFull: false
        },
        {
          maxSlotSize: '',
          currentSlotSize: '',
          discountPercentage: '',
          isFull: false
        },
        {
          maxSlotSize: '',
          currentSlotSize: '',
          discountPercentage: '',
          isFull: false
        }
      ]
    };

    // Fetch existing slot data for this product
    try {
      const slotsResponse = await fetch(`http://localhost:8085/tricto/slots/product/${product.productId}`, {
        headers: {
          'Authorization': `Bearer ${authState.profile?.token}`
        }
      });

      if (slotsResponse.ok) {
        const slots = await slotsResponse.json();
        // Load up to 3 slots into the form
        for (let i = 0; i < Math.min(slots.length, 3); i++) {
          const slot = slots[i];
          formDataToSet.slots[i] = {
            maxSlotSize: slot.maxSlotSize,
            currentSlotSize: slot.currentSlotSize,
            discountPercentage: slot.discountPercentage,
            isFull: slot.isFull
          };
        }
      }
    } catch (error) {
      console.error('Error fetching slot data:', error);
    }

    setFormData(formDataToSet);
    setShowEditModal(true);
  };

  /**
   * Resets the form data to initial empty state
   * Clears all product fields and slot configurations
   */
  const resetForm = () => {
    setFormData({
      productName: '',
      description: '',
      price: '',
      categoryId: '',
      quantity: '',
      images: [],
      imageUrl1: '',
      imageUrl2: '',
      imageUrl3: '',
      slots: [
        {
          maxSlotSize: '',
          currentSlotSize: '',
          discountPercentage: '',
          isFull: false
        },
        {
          maxSlotSize: '',
          currentSlotSize: '',
          discountPercentage: '',
          isFull: false
        },
        {
          maxSlotSize: '',
          currentSlotSize: '',
          discountPercentage: '',
          isFull: false
        }
      ]
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Products Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-coral-red text-white px-4 py-2 rounded-lg hover:bg-coral-red/80 transition-colors"
        >
          ➕ Add Product
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Images
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.productId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={product.images?.[0]?.img1 || product.imgURL || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNS41ODQ5IDEyIDEyIDE1LjU4NDkgMTIgMjBDMTIgMjQuNDE1MSAxNS41ODQ5IDI4IDIwIDI4QzI0LjQxNTEgMjggMjggMjQuNDE1MSAyOCAyMEMyOCAxNS41ODQ5IDI0LjQxNTEgMTIgMjAgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yMCAyNkMyMi4yMDkxIDI2IDI0IDI0LjIwOTEgMjQgMjJDMjQgMTkuNzkwOSAyMi4yMDkxIDE4IDIwIDE4QzE3Ljc5MDkgMTggMTYgMTkuNzkwOSAxNiAyMkMxNiAyNC4yMDkxIDE3Ljc5MDkgMjYgMjAgMjZaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo='}
                          alt={product.productName}
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNS41ODQ5IDEyIDEyIDE1LjU4NDkgMTIgMjBDMTIgMjQuNDE1MSAxNS41ODQ5IDI4IDIwIDI4QzI0LjQxNTEgMjggMjggMjQuNDE1MSAyOCAyMEMyOCAxNS41ODQ5IDI0LjQxNTEgMTIgMjAgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yMCAyNkMyMi4yMDkxIDI2IDI0IDI0LjIwOTEgMjQgMjJDMjQgMTkuNzkwOSAyMi4yMDkxIDE4IDIwIDE4QzE3Ljc5MDkgMTggMTYgMTkuNzkwOSAxNiAyMkMxNiAyNC4yMDkxIDE3Ljc5MDkgMjYgMjAgMjZaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                            e.target.alt = 'Image not found';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.productName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.description?.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {product.images?.[0]?.img1 && (
                        <img
                          className="h-8 w-8 rounded object-cover border"
                          src={product.images[0].img1}
                          alt="Image 1"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      {product.images?.[0]?.img2 && (
                        <img
                          className="h-8 w-8 rounded object-cover border"
                          src={product.images[0].img2}
                          alt="Image 2"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      {product.images?.[0]?.img3 && (
                        <img
                          className="h-8 w-8 rounded object-cover border"
                          src={product.images[0].img3}
                          alt="Image 3"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      {(!product.images?.[0]?.img1 && !product.images?.[0]?.img2 && !product.images?.[0]?.img3) && (
                        <span className="text-xs text-gray-400">No images</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.categoryName || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.productId)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Product</h3>
              <form onSubmit={handleAddProduct}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                      type="text"
                      value={formData.productName}
                      onChange={(e) => setFormData({...formData, productName: e.target.value})}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL 1</label>
                    <input
                      type="url"
                      value={formData.imageUrl1}
                      onChange={(e) => setFormData({...formData, imageUrl1: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      placeholder="https://example.com/image1.jpg"
                    />
                    <p className="mt-1 text-xs text-gray-500">Primary product image (required)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL 2</label>
                    <input
                      type="url"
                      value={formData.imageUrl2}
                      onChange={(e) => setFormData({...formData, imageUrl2: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      placeholder="https://example.com/image2.jpg"
                    />
                    <p className="mt-1 text-xs text-gray-500">Secondary product image (optional)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL 3</label>
                    <input
                      type="url"
                      value={formData.imageUrl3}
                      onChange={(e) => setFormData({...formData, imageUrl3: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      placeholder="https://example.com/image3.jpg"
                    />
                    <p className="mt-1 text-xs text-gray-500">Additional product image (optional)</p>
                  </div>
                  
                  {/* Image Preview Section */}
                  {(formData.imageUrl1 || formData.imageUrl2 || formData.imageUrl3) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                      <div className="grid grid-cols-3 gap-2">
                        {formData.imageUrl1 && (
                          <div className="relative">
                            <img
                              src={formData.imageUrl1}
                              alt="Preview 1"
                              className="w-full h-20 object-cover rounded border"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNS41ODQ5IDEyIDEyIDE1LjU4NDkgMTIgMjBDMTIgMjQuNDE1MSAxNS41ODQ5IDI4IDIwIDI4QzI0LjQxNTEgMjggMjggMjQuNDE1MSAyOCAyMEMyOCAxNS41ODQ5IDI0LjQxNTEgMTIgMjAgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yMCAyNkMyMi4yMDkxIDI2IDI0IDI0LjIwOTEgMjQgMjJDMjQgMTkuNzkwOSAyMi4yMDkxIDE4IDIwIDE4QzE3Ljc5MDkgMTggMTYgMTkuNzkwOSAxNiAyMkMxNiAyNC4yMDkxIDE3Ljc5MDkgMjYgMjAgMjZaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                                e.target.alt = 'Image not found';
                              }}
                            />
                            <span className="absolute top-0 left-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded">1</span>
                          </div>
                        )}
                        {formData.imageUrl2 && (
                          <div className="relative">
                            <img
                              src={formData.imageUrl2}
                              alt="Preview 2"
                              className="w-full h-20 object-cover rounded border"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNS41ODQ5IDEyIDEyIDE1LjU4NDkgMTIgMjBDMTIgMjQuNDE1MSAxNS41ODQ5IDI4IDIwIDI4QzI0LjQxNTEgMjggMjggMjQuNDE1MSAyOCAyMEMyOCAxNS41ODQ5IDI0LjQxNTEgMTIgMjAgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yMCAyNkMyMi4yMDkxIDI2IDI0IDI0LjIwOTEgMjQgMjJDMjQgMTkuNzkwOSAyMi4yMDkxIDE4IDIwIDE4QzE3Ljc5MDkgMTggMTYgMTkuNzkwOSAxNiAyMkMxNiAyNC4yMDkxIDE3Ljc5MDkgMjYgMjAgMjZaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                                e.target.alt = 'Image not found';
                              }}
                            />
                            <span className="absolute top-0 left-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded">2</span>
                          </div>
                        )}
                        {formData.imageUrl3 && (
                          <div className="relative">
                            <img
                              src={formData.imageUrl3}
                              alt="Preview 3"
                              className="w-full h-20 object-cover rounded border"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNS41ODQ5IDEyIDEyIDE1LjU4NDkgMTIgMjBDMTIgMjQuNDE1MSAxNS41ODQ5IDI4IDIwIDI4QzI0LjQxNTEgMjggMjggMjQuNDE1MSAyOCAyMEMyOCAxNS41ODQ5IDI0LjQxNTEgMTIgMjAgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yMCAyNkMyMi4yMDkxIDI2IDI0IDI0LjIwOTEgMjQgMjJDMjQgMTkuNzkwOSAyMi4yMDkxIDE4IDIwIDE4QzE3Ljc5MDkgMTggMTYgMTkuNzkwOSAxNiAyMkMxNiAyNC4yMDkxIDE3Ljc5MDkgMjYgMjAgMjZaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                                e.target.alt = 'Image not found';
                              }}
                            />
                            <span className="absolute top-0 left-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded">3</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Multiple Slot Configuration Section */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Slot Configuration (Optional)</h4>
                    <p className="text-xs text-gray-500 mb-4">Configure up to 3 discount tiers for this product</p>
                    
                    {formData.slots.map((slot, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Slot {index + 1}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Max Slot Size</label>
                            <input
                              type="number"
                              value={slot.maxSlotSize}
                              onChange={(e) => {
                                const newSlots = [...formData.slots];
                                newSlots[index].maxSlotSize = e.target.value;
                                setFormData({...formData, slots: newSlots});
                              }}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                              placeholder="e.g., 25000"
                            />
                            <p className="mt-1 text-xs text-gray-500">Maximum capacity</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Current Size</label>
                            <input
                              type="number"
                              value={slot.currentSlotSize}
                              onChange={(e) => {
                                const newSlots = [...formData.slots];
                                newSlots[index].currentSlotSize = e.target.value;
                                setFormData({...formData, slots: newSlots});
                              }}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                              placeholder="0"
                            />
                            <p className="mt-1 text-xs text-gray-500">Current filled</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Discount %</label>
                            <input
                              type="number"
                              value={slot.discountPercentage}
                              onChange={(e) => {
                                const newSlots = [...formData.slots];
                                newSlots[index].discountPercentage = e.target.value;
                                setFormData({...formData, slots: newSlots});
                              }}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                              placeholder="e.g., 25"
                              min="0"
                              max="100"
                            />
                            <p className="mt-1 text-xs text-gray-500">Discount percentage</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center">
                          <input
                            type="checkbox"
                            id={`isFull-${index}`}
                            checked={slot.isFull}
                            onChange={(e) => {
                              const newSlots = [...formData.slots];
                              newSlots[index].isFull = e.target.checked;
                              setFormData({...formData, slots: newSlots});
                            }}
                            className="h-4 w-4 text-coral-red focus:ring-coral-red border-gray-300 rounded"
                          />
                          <label htmlFor={`isFull-${index}`} className="ml-2 block text-sm text-gray-900">
                            Slot is Full
                          </label>
                        </div>
                      </div>
                    ))}
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
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Product</h3>
              <form onSubmit={handleEditProduct}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                      type="text"
                      value={formData.productName}
                      onChange={(e) => setFormData({...formData, productName: e.target.value})}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL 1</label>
                    <input
                      type="url"
                      value={formData.imageUrl1}
                      onChange={(e) => setFormData({...formData, imageUrl1: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      placeholder="https://example.com/image1.jpg"
                    />
                    <p className="mt-1 text-xs text-gray-500">Primary product image (required for best display)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL 2</label>
                    <input
                      type="url"
                      value={formData.imageUrl2}
                      onChange={(e) => setFormData({...formData, imageUrl2: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      placeholder="https://example.com/image2.jpg"
                    />
                    <p className="mt-1 text-xs text-gray-500">Secondary product image (optional)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL 3</label>
                    <input
                      type="url"
                      value={formData.imageUrl3}
                      onChange={(e) => setFormData({...formData, imageUrl3: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                      placeholder="https://example.com/image3.jpg"
                    />
                    <p className="mt-1 text-xs text-gray-500">Additional product image (optional)</p>
                  </div>
                  
                  {/* Image Preview Section */}
                  {(formData.imageUrl1 || formData.imageUrl2 || formData.imageUrl3) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                      <div className="grid grid-cols-3 gap-2">
                        {formData.imageUrl1 && (
                          <div className="relative">
                            <img
                              src={formData.imageUrl1}
                              alt="Preview 1"
                              className="w-full h-20 object-cover rounded border"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNS41ODQ5IDEyIDEyIDE1LjU4NDkgMTIgMjBDMTIgMjQuNDE1MSAxNS41ODQ5IDI4IDIwIDI4QzI0LjQxNTEgMjggMjggMjQuNDE1MSAyOCAyMEMyOCAxNS41ODQ5IDI0LjQxNTEgMTIgMjAgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yMCAyNkMyMi4yMDkxIDI2IDI0IDI0LjIwOTEgMjQgMjJDMjQgMTkuNzkwOSAyMi4yMDkxIDE4IDIwIDE4QzE3Ljc5MDkgMTggMTYgMTkuNzkwOSAxNiAyMkMxNiAyNC4yMDkxIDE3Ljc5MDkgMjYgMjAgMjZaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                                e.target.alt = 'Image not found';
                              }}
                            />
                            <span className="absolute top-0 left-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded">1</span>
                          </div>
                        )}
                        {formData.imageUrl2 && (
                          <div className="relative">
                            <img
                              src={formData.imageUrl2}
                              alt="Preview 2"
                              className="w-full h-20 object-cover rounded border"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNS41ODQ5IDEyIDEyIDE1LjU4NDkgMTIgMjBDMTIgMjQuNDE1MSAxNS41ODQ5IDI4IDIwIDI4QzI0LjQxNTEgMjggMjggMjQuNDE1MSAyOCAyMEMyOCAxNS41ODQ5IDI0LjQxNTEgMTIgMjAgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yMCAyNkMyMi4yMDkxIDI2IDI0IDI0LjIwOTEgMjQgMjJDMjQgMTkuNzkwOSAyMi4yMDkxIDE4IDIwIDE4QzE3Ljc5MDkgMTggMTYgMTkuNzkwOSAxNiAyMkMxNiAyNC4yMDkxIDE3Ljc5MDkgMjYgMjAgMjZaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                                e.target.alt = 'Image not found';
                              }}
                            />
                            <span className="absolute top-0 left-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded">2</span>
                          </div>
                        )}
                        {formData.imageUrl3 && (
                          <div className="relative">
                            <img
                              src={formData.imageUrl3}
                              alt="Preview 3"
                              className="w-full h-20 object-cover rounded border"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNS41ODQ5IDEyIDEyIDE1LjU4NDkgMTIgMjBDMTIgMjQuNDE1MSAxNS41ODQ5IDI4IDIwIDI4QzI0LjQxNTEgMjggMjggMjQuNDE1MSAyOCAyMEMyOCAxNS41ODQ5IDI0LjQxNTEgMTIgMjAgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yMCAyNkMyMi4yMDkxIDI2IDI0IDI0LjIwOTEgMjQgMjJDMjQgMTkuNzkwOSAyMi4yMDkxIDE4IDIwIDE4QzE3Ljc5MDkgMTggMTYgMTkuNzkwOSAxNiAyMkMxNiAyNC4yMDkxIDE3Ljc5MDkgMjYgMjAgMjZaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                                e.target.alt = 'Image not found';
                              }}
                            />
                            <span className="absolute top-0 left-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded">3</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Multiple Slot Configuration Section */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Slot Configuration (Optional)</h4>
                    <p className="text-xs text-gray-500 mb-4">Configure up to 3 discount tiers for this product</p>
                    
                    {formData.slots.map((slot, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Slot {index + 1}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Max Slot Size</label>
                            <input
                              type="number"
                              value={slot.maxSlotSize}
                              onChange={(e) => {
                                const newSlots = [...formData.slots];
                                newSlots[index].maxSlotSize = e.target.value;
                                setFormData({...formData, slots: newSlots});
                              }}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                              placeholder="e.g., 25000"
                            />
                            <p className="mt-1 text-xs text-gray-500">Maximum capacity</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Current Size</label>
                            <input
                              type="number"
                              value={slot.currentSlotSize}
                              onChange={(e) => {
                                const newSlots = [...formData.slots];
                                newSlots[index].currentSlotSize = e.target.value;
                                setFormData({...formData, slots: newSlots});
                              }}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                              placeholder="0"
                            />
                            <p className="mt-1 text-xs text-gray-500">Current filled</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Discount %</label>
                            <input
                              type="number"
                              value={slot.discountPercentage}
                              onChange={(e) => {
                                const newSlots = [...formData.slots];
                                newSlots[index].discountPercentage = e.target.value;
                                setFormData({...formData, slots: newSlots});
                              }}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-coral-red focus:border-coral-red"
                              placeholder="e.g., 25"
                              min="0"
                              max="100"
                            />
                            <p className="mt-1 text-xs text-gray-500">Discount percentage</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center">
                          <input
                            type="checkbox"
                            id={`isFullEdit-${index}`}
                            checked={slot.isFull}
                            onChange={(e) => {
                              const newSlots = [...formData.slots];
                              newSlots[index].isFull = e.target.checked;
                              setFormData({...formData, slots: newSlots});
                            }}
                            className="h-4 w-4 text-coral-red focus:ring-coral-red border-gray-300 rounded"
                          />
                          <label htmlFor={`isFullEdit-${index}`} className="ml-2 block text-sm text-gray-900">
                            Slot is Full
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedProduct(null);
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
                    Update Product
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

export default AdminProducts; 
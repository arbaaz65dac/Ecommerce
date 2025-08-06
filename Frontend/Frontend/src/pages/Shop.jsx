import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../slices/productsSlice';
import { PopularProductCard } from '../components';

const getCategoryName = (categoryId) => {
  const categoryNames = {
    1: 'Beauty',
    2: 'Fragrances',
    3: 'Furniture',
    4: 'Groceries',
    5: 'Home Decoration',
    6: 'Kitchen Accessories',
    7: 'Laptops',
    8: 'Men Shirts',
    9: 'Men Shoes',
    10: 'Men Watches',
    11: 'Mobile Accessories'
  };
  return categoryNames[categoryId] || `Category ${categoryId}`;
};

const Shop = () => {
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector(state => state.products);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  // Get unique categories from products - handle both category and categoryId
  const getProductCategory = (product) => {
    return product.category || product.categoryId || 'uncategorized';
  };

  const categories = ['all', ...new Set(products.map(getProductCategory))];

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => getProductCategory(product) === selectedCategory);

  if (status === 'failed') {
    return (
      <section className="padding min-h-screen bg-white">
        <div className="max-container">
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Failed to load products</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={() => dispatch(fetchProducts())}
              className="bg-coral-red text-white px-6 py-2 rounded-full hover:bg-coral-red/80"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="padding min-h-screen bg-white">
      <div className="max-container">
        <div className="mb-8">
          <h1 className="font-palanquin text-3xl sm:text-4xl font-bold capitalize">
            Shop
          </h1>
          <p className="text-slate-gray font-montserrat mt-1">Find your perfect shoes</p>
        </div>

        {/* Category Filter */}
        {products.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-montserrat transition-colors ${
                    selectedCategory === category
                      ? 'bg-coral-red text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category === 'all' ? 'All Products' : 
                   category === 'uncategorized' ? 'Uncategorized' :
                   isNaN(category) ? category.charAt(0).toUpperCase() + category.slice(1) :
                   getCategoryName(parseInt(category))}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {status === 'loading' ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-red"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
            {filteredProducts.map((product) => (
              <PopularProductCard key={product.productId} {...product} />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && status !== 'loading' && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-600">No products found</h2>
            <p className="text-gray-500 mt-2">Try selecting a different category</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Shop;

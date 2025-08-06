import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { fetchProducts } from '../slices/productsSlice';
import { fetchProductSlots } from '../slices/slotsSlice';
import { star } from '../assets/icons';

const resolveImage = (img) => {
  if (!img) return '';
  if (img.startsWith('http')) return img;
  if (img.startsWith('/')) return img;
  try {
    return require(`../assets/images/${img}`);
  } catch {
    return img;
  }
};

const ProductPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(state => state.products.items);
  const productsStatus = useSelector(state => state.products.status);
  const cartItems = useSelector(state => state.cart?.items || []);
  const slots = useSelector(state => state.slots.productSlots[productId] || []);
  const slotsStatus = useSelector(state => state.slots.status);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);

  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, productsStatus]);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductSlots(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    const foundProduct = products.find(p => String(p.productId) === String(productId));
    if (foundProduct) {
      setProduct({ ...foundProduct });
      setSelectedImage(
        foundProduct.images?.length > 0 ? foundProduct.images[0].img1 : (foundProduct.thumbnail || foundProduct.imgURL)
      );
    }
  }, [productId, products]);

  if (productsStatus === 'loading') {
    return (
      <div className="padding min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-red mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold font-palanquin">Loading product...</h1>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="padding min-h-screen flex justify-center items-center">
        <h1 className="text-2xl font-bold font-palanquin">Product not found!</h1>
      </div>
    );
  }

  const galleryImages = product.images?.length ? product.images.map(img => img.img1) : [product.thumbnail || product.imgURL];
  const name = product.productName;
  const description = product.description;
  const price = product.price;
  const rating = product.rating;
  
  // Use real slot data if available, otherwise use default
  const selectedTier = selectedTierIndex === -1 ? null : slots[selectedTierIndex];
  const finalPrice = selectedTierIndex === -1 ? price : (parseFloat(price) * (1 - (selectedTier?.discountPercentage || 0) / 100)).toFixed(2);

  return (
    <section className="padding min-h-screen bg-white">
      <div className="max-container">
        <div className="mb-8">
          <h1 className="font-palanquin text-3xl sm:text-4xl font-bold capitalize">
            {name}
          </h1>
          <p className="text-slate-gray font-montserrat mt-1">Product ID: {product.productId}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
          {/* Image Gallery */}
          <div className="lg:w-2/5 flex flex-col items-center">
            <img
              src={resolveImage(selectedImage)}
              alt={name}
              className="rounded-xl shadow-lg w-full max-w-md object-contain aspect-square"
            />
            {galleryImages.length > 1 && (
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {galleryImages.map((img, index) => (
                  <img
                    key={index}
                    src={resolveImage(img)}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 transition-all duration-200 ${
                      selectedImage === img
                        ? 'border-coral-red'
                        : 'border-gray-200 hover:border-coral-red'
                    }`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="lg:w-3/5 flex flex-col">
            <div className="text-coral-red text-2xl font-semibold font-montserrat">
              ₹{finalPrice}
              {selectedTierIndex !== -1 && (
                <span className="line-through text-gray-400 text-xl ml-2">
                  ₹{price}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <img src={star} alt="rating" width={24} height={24} />
              <p className="text-slate-gray font-montserrat text-lg">
                {rating ?? 'No rating'}
              </p>
            </div>

            {/* Description */}
            <p className="mt-6 text-slate-gray font-montserrat leading-relaxed whitespace-pre-line text-lg">
              {description ?? 'No description available.'}
            </p>

            {/* Tiers Selection */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-bold font-montserrat text-lg">
                  Select Discount Tier (Delivery after full fill):
                </h3>

                {/* Improved Tooltip */}
                <div className="relative group">
                  <button className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 hover:bg-gray-300 transition-colors">
                    i
                  </button>
                  <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-[90vw] max-w-xs sm:max-w-md px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-xl text-sm text-gray-700 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                    <div className="font-semibold mb-1 text-coral-red">How Our Multi-Tier Pricing Works:</div>
                    <div className="space-y-1 text-xs">
                      <div>• <strong>25% Discount:</strong> When 25,000 people join, we sell at 75% off</div>
                      <div>• <strong>50% Discount:</strong> When 50,000 people join, we sell at 50% off</div>
                      <div>• <strong>75% Discount:</strong> When 100,000 people join, we sell at 25% off</div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      The more people join, the bigger your discount! Choose your preferred tier and wait for it to fill up.
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                  </div>
                </div>
              </div>

              {/* Default Price Option */}
              <div className="mb-4 p-4 border-2 border-green-200 rounded-lg bg-green-50">
                <label className="flex items-center gap-2 mb-2 text-sm font-medium text-green-800 cursor-pointer">
                  <input
                    type="radio"
                    name="discount-tier"
                    value="default"
                    checked={selectedTierIndex === -1}
                    onChange={() => setSelectedTierIndex(-1)}
                  />
                  <span className="font-semibold">Buy Now at Regular Price</span>
                </label>
                <div className="text-green-700 text-sm">
                  <span className="font-semibold">₹{price}</span> - Immediate delivery, no waiting required
                </div>
              </div>

              {/* Slot Options */}
              {slotsStatus === 'loading' ? (
                <div className="mb-4 p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-coral-red"></div>
                    <span className="text-gray-600">Loading slot options...</span>
                  </div>
                </div>
              ) : slots.length > 0 ? (
                slots.map((slot, index) => {
                  const progress = Math.min((slot.currentSlotSize / slot.maxSlotSize) * 100, 100);
                  return (
                    <div key={slot.slotId} className="mb-4">
                      <label className="flex items-center gap-2 mb-1 text-sm font-medium text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="discount-tier"
                          value={slot.discountPercentage}
                          checked={selectedTierIndex === index}
                          onChange={() => setSelectedTierIndex(index)}
                          disabled={slot.isFull}
                        />
                        {slot.discountPercentage}% off — {slot.currentSlotSize.toLocaleString()} /
                        {slot.maxSlotSize.toLocaleString()} joined
                        {slot.isFull && <span className="text-red-500 ml-2">(Full)</span>}
                      </label>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            progress <= 25 ? 'bg-red-500' : 
                            progress <= 75 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="mb-4 p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-gray-600 text-sm">No slot options available for this product.</p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-10 flex gap-4">
              <button
                className="bg-coral-red text-white px-6 py-3 font-montserrat rounded-full transition-colors hover:bg-coral-red/80"
                onClick={() => dispatch(addToCart({ 
                  id: product.productId, // Map productId to id
                  imgURL: product.images?.[0]?.img1 || product.thumbnail || product.imgURL,
                  name: product.productName,
                  price: finalPrice,
                  rating: product.rating || "4.5",
                  cartQuantity: 1,
                  selectedSlotId: selectedTierIndex === -1 ? null : selectedTier?.slotId
                }))}
              >
                Add to Cart
              </button>
              <button
                className="bg-black hover:bg-gray-800 text-white px-6 py-3 font-montserrat rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  if (cartItems.length > 0) {
                    alert('Please clear your cart before using Buy Now, or use Add to Cart instead.');
                    return;
                  }
                  
                  dispatch(addToCart({ 
                    id: product.productId, // Map productId to id
                    imgURL: product.images?.[0]?.img1 || product.thumbnail || product.imgURL,
                    name: product.productName,
                    price: finalPrice,
                    rating: product.rating || "4.5",
                    cartQuantity: 1,
                    selectedSlotId: selectedTierIndex === -1 ? null : selectedTier?.slotId
                  }));
                  
                  setTimeout(() => {
                    navigate('/checkout');
                  }, 200);
                }}
                disabled={cartItems.length > 0}
              >
                {cartItems.length > 0 ? 'Cart Not Empty' : (selectedTierIndex === -1 ? 'Buy Now at Regular Price' : `Buy Now at ${selectedTier?.discountPercentage}% Off`)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;

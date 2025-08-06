import { star } from '../assets/icons';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../slices/cartSlice';

const PopularProductCard = (props) => {
  const dispatch = useDispatch();
  const isOrderInProgress = useSelector(state => state.cart?.isOrderInProgress || false);
  
  // Support new JSON structure
  const id = props.productId || props.id; // Handle both productId and id
  const imgURL = props.images?.[0]?.img1 || props.imgURL || '/fallback-image.jpg';
  const name = props.productName || props.name;
  const price = props.price;
  const rating = props.rating || "4.5";

  const handleClick = (event) => {
    // For analytics/debug
  };

  return (
    <div className='relative z-20 flex flex-col w-full max-sm:w-full group cursor-pointer pointer-events-auto h-full'>
      <div className='flex flex-col h-full'>
        <Link
          to={`/product/${id}`}
          onClick={handleClick}
          aria-label={`View ${name || 'product'} details`}
          className='flex flex-col flex-grow'
        >
          <img
            src={imgURL || '/fallback-image.jpg'}
            alt={name || 'Product'}
            className='w-[282px] h-[282px] object-cover rounded-xl group-hover:scale-105 transition-transform duration-300'
          />
          <div className='mt-8 flex items-center gap-2.5'>
            <img
              src={star || '/fallback-star.png'}
              alt='rating icon'
              width={24}
              height={24}
            />
            <p className='font-montserrat text-xl text-slate-gray'>
              ({rating || 'N/A'})
            </p>
          </div>
          <h3 className='mt-2 text-2xl font-semibold font-palanquin group-hover:text-coral-red transition-colors min-h-[3rem] flex items-center'>
            {name || 'Unnamed Product'}
          </h3>
          <p className='mt-2 text-2xl font-semibold font-montserrat text-coral-red'>
            ₹{price || 'N/A'}
          </p>
        </Link>
        <button
          className='mt-4 bg-coral-red text-white px-4 py-2 rounded-full font-semibold hover:bg-coral-red/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full'
          onClick={() => dispatch(addToCart({ 
            id: id, // Use the correct ID
            imgURL: imgURL,
            name: name,
            price: price,
            rating: rating,
            cartQuantity: 1 
          }))}
          disabled={isOrderInProgress}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default PopularProductCard;
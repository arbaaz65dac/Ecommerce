import { useState, useEffect } from "react";
import { Button } from "../components";

const SuperQuality = () => {
  const [featuredProduct, setFeaturedProduct] = useState(null);

  useEffect(() => {
    // Fetch a featured product for this section
    const fetchFeaturedProduct = async () => {
      try {
        const response = await fetch('http://localhost:8085/tricto/products');
        const data = await response.json();
        // Select a product with multiple images (fragrance category)
        const productWithMultipleImages = data.find(product => 
          product.images[0]?.img2 && product.images[0]?.img3
        );
        setFeaturedProduct(productWithMultipleImages || data[0]);
      } catch (error) {
        console.error('Error fetching featured product:', error);
      }
    };

    fetchFeaturedProduct();
  }, []);

  return (
    <section
      id='about-us'
      className='flex justify-between items-center max-lg:flex-col gap-10 w-full max-container'
    >
      <div className='flex flex-1 flex-col'>
        <h2 className='font-palanquin capitalize text-4xl lg:max-w-lg font-bold'>
          We Provide You
          <span className='text-coral-red'> Premium </span>
          <span className='text-coral-red'>Quality </span> Products
        </h2>
        <p className='mt-4 lg:max-w-lg info-text'>
          Ensuring premium quality and style, our meticulously curated products
          are designed to elevate your lifestyle, providing you with unmatched
          quality, innovation, and a touch of elegance.
        </p>
        <p className='mt-6 lg:max-w-lg info-text'>
          Our dedication to detail and excellence ensures your satisfaction
        </p>
        <div className='mt-11'>
          <Button label='View details' />
        </div>
      </div>

      <div className='flex-1 flex justify-center items-center'>
        {featuredProduct && (
          <img
            src={featuredProduct.images[0]?.img1 || ""}
            alt={featuredProduct.productName || 'featured product'}
            width={570}
            height={522}
            className='object-contain max-w-[400px] max-h-[400px]'
          />
        )}
      </div>
    </section>
  );
};

export default SuperQuality;

import { useState, useEffect } from "react";
import { arrowRight } from "../assets/icons";
import { Button } from "../components";

const SpecialOffer = () => {
  const [specialProduct, setSpecialProduct] = useState(null);

  useEffect(() => {
    // Fetch a special product for this section
    const fetchSpecialProduct = async () => {
      try {
        const response = await fetch('http://localhost:8085/tricto/products');
        const data = await response.json();
        // Select a luxury product (fragrance or furniture)
        const luxuryProduct = data.find(product => 
          product.price > 50 && product.images[0]?.img1
        );
        setSpecialProduct(luxuryProduct || data[0]);
      } catch (error) {
        console.error('Error fetching special product:', error);
      }
    };

    fetchSpecialProduct();
  }, []);

  return (
    <section className='flex justify-between items-center max-xl:flex-col-reverse gap-10 max-container'>
      <div className='flex-1'>
        {specialProduct && (
          <img
            src={specialProduct.images[0]?.img1 || ""}
            alt={specialProduct.productName || 'Special Offer Product'}
            width={773}
            height={687}
            className='object-contain w-full max-w-[500px] max-h-[400px]'
          />
        )}
      </div>
      <div className='flex flex-1 flex-col'>
        <h2 className='text-4xl font-palanquin font-bold'>
          <span className='text-coral-red'>Special </span>
          Offer
        </h2>
        <p className='mt-4 info-text'>
          Embark on a shopping journey that redefines your experience with
          unbeatable deals. From premier selections to incredible savings, we
          offer unparalleled value that sets us apart.
        </p>
        <p className='mt-6 info-text'>
          Navigate a realm of possibilities designed to fulfill your unique
          desires, surpassing the loftiest expectations. Your journey with us is
          nothing short of exceptional.
        </p>
        <div className='mt-11 flex flex-wrap gap-4'>
          <Button label='Shop now' iconURL={arrowRight} />
          <Button
            label='Learn more'
            backgroundColor='bg-white'
            borderColor='border-slate-gray'
            textColor='text-slate-gray'
          />
        </div>
      </div>
    </section>
  );
};

export default SpecialOffer;

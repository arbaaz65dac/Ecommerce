import { useState, useEffect } from "react";

import { statistics } from "../constants";
import { Button, ProductCard } from "../components";
import { arrowRight } from "../assets/icons";

const Hero = () => {
  const [products, setProducts] = useState([]);
  const [bigProductImg, setBigProductImg] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Fetch products for hero section
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8085/tricto/products');
        const data = await response.json();
        // Select first 3 products for hero showcase
        const heroProducts = data.slice(0, 3);
        setProducts(heroProducts);
        if (heroProducts.length > 0) {
          setBigProductImg(heroProducts[0].images[0]?.img1 || "");
          setSelectedProduct(heroProducts[0]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductChange = (product) => {
    setSelectedProduct(product);
    setBigProductImg(product.images[0]?.img1 || "");
  };

  return (
    <section
      id='home'
      className='w-full flex xl:flex-row flex-col justify-center min-h-screen gap-10 max-container'
    >
      <div className='relative xl:w-2/5 flex flex-col justify-center items-start w-full  max-xl:padding-x pt-28'>
        <p className='text-xl font-montserrat text-coral-red'>
          Our Featured Collection
        </p>

        <h1 className='mt-10 font-palanquin text-8xl max-sm:text-[72px] max-sm:leading-[82px] font-bold'>
          <span className='xl:bg-white xl:whitespace-nowrap relative z-10 pr-10'>
            Discover Amazing
          </span>
          <br />
          <span className='text-coral-red inline-block mt-3'>Products</span>
        </h1>
        <p className='font-montserrat text-slate-gray text-lg leading-8 mt-6 mb-14 sm:max-w-sm'>
          Explore our curated collection of premium products, from beauty essentials to luxury fragrances and elegant furniture.
        </p>

        <Button label='Shop now' iconURL={arrowRight} />

        <div className='flex justify-start items-start flex-wrap w-full mt-20 gap-16'>
          {statistics.map((stat, index) => (
            <div key={index}>
              <p className='text-4xl font-palanquin font-bold'>{stat.value}</p>
              <p className='leading-7 font-montserrat text-slate-gray'>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className='relative flex-1 flex justify-center items-center xl:min-h-screen max-xl:py-40 bg-primary bg-hero bg-cover bg-center'>
        {bigProductImg && (
          <img
            src={bigProductImg}
            alt={selectedProduct?.productName || 'featured product'}
            width={610}
            height={502}
            className='object-contain relative z-10 max-w-[500px] max-h-[400px]'
          />
        )}

        <div className='flex sm:gap-6 gap-4 absolute -bottom-[5%] sm:left-[10%] max-sm:px-6'>
          {products.map((product, index) => (
            <div key={index}>
              <ProductCard
                index={index}
                imgURL={product.images[0]?.img1 || ""}
                changeBigShoeImage={() => handleProductChange(product)}
                bigShoeImg={bigProductImg}
                productName={product.productName}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

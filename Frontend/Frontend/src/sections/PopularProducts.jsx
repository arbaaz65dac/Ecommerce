import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PopularProductCard } from "../components";
import { fetchProducts } from "../slices/productsSlice";

const PopularProducts = () => {
  const dispatch = useDispatch();
  const { items: products, status } = useSelector(state => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  return (
    <section id="products" className="max-container max-sm:mt-12">
      <div className="flex flex-col justify-start gap-5">
        <h2 className="text-4xl font-palanquin font-bold">
          Our <span className="text-coral-red">Popular</span> Products
        </h2>
        <p className="lg:max-w-lg mt-2 font-montserrat text-slate-gray">
          Experience top-notch quality and style with our sought-after selections. Discover a world of comfort, design, and value.
        </p>
      </div>

      {status === 'loading' ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-red"></div>
        </div>
      ) : (
        <div className="mt-16 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-14">
          {products.slice(0, 4).map((product) => (
            <PopularProductCard key={product.productId} {...product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default PopularProducts;

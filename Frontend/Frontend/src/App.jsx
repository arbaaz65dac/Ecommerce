import { Nav } from "./components";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ProductPage from "./pages/ProductPage"; 
import Auth from "./components/Auth";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import UserProfile from './pages/UserProfile';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import { useAuth } from './hooks/useAuth';
import { useDispatch } from 'react-redux';
import { initializeCart } from './slices/cartSlice';
import { useEffect } from 'react';
// Import ProductPage from its new location
// import { useParams } from "react-router-dom"; // You'll need this in ProductPage.jsx
import {
  CustomerReviews,
  Footer,
  Hero,
  PopularProducts,
  Services,
  SpecialOffer,
  Subscribe,
  SuperQuality,
} from "./sections";

// Component to group all sections of the home page
const HomePage = () => (
  <>
    <section className='xl:padding-l wide:padding-r padding-b'>
      <Hero />
    </section>
    <section className='padding'>
      {/* When a product is clicked in PopularProducts, it should navigate to /product/:id */}
      <PopularProducts />
    </section>
    <section className='padding'>
      <SuperQuality />
    </section>
    <section className='padding-x py-10'>
      <Services />
    </section>
    <section className='padding'>
      <SpecialOffer />
    </section>
    <section className='bg-pale-blue padding'>
      <CustomerReviews />
    </section>
    <section className='padding-x sm:py-32 py-16 w-full'>
      <Subscribe />
    </section>
  </>
);

const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  
  return (
    <main className='relative'>
      {!isAdminPage && <Nav />} {/* Hide Nav on admin page */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {/* Footer is outside Routes. If you want it only on the HomePage, move it into the HomePage component.
          If you want different footers per page, you might need a more complex layout structure.
          For now, it remains at the bottom of all routed pages.
      */}
      <section className=' bg-black padding-x padding-t pb-8'>
       <Footer />
      </section>
    </main>
  );
};

const App = () => {
  // Initialize authentication
  useAuth();
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeCart());
  }, [dispatch]);
  
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

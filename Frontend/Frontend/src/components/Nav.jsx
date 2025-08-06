import { hamburger } from "../assets/icons";
import { headerLogo } from "../assets/images";
import { navLinks } from "../constants";
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../slices/authSlice';
import { useState } from 'react';

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cart = useSelector(state => state.cart?.items || []);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const profile = useSelector(state => state.auth.profile);
  const dispatch = useDispatch();
  
  // Debug logging
  console.log('Nav component - profile:', profile);
  console.log('Nav component - profile role:', profile?.role);
  console.log('Nav component - is admin check:', profile && profile.role === 'ADMIN');
  
  // Temporary test: Force admin role for testing
  const isAdmin = profile && (profile.role === 'ADMIN' || profile.email === 'admin@tricto.com');
  console.log('Nav component - isAdmin check:', isAdmin);
  return (
    <header className='padding-x absolute z-10 w-full'>
      <nav className='flex justify-between items-center max-container'>
        {/* Left Side: Logo and Navigation */}
        <div className='flex items-center gap-8'>
          {/* Logo */}
          <a href='/' className='flex-shrink-0'>
            <img
              src={headerLogo}
              alt='logo'
              width={129}
              height={29}
              className='m-0 w-[129px] h-[29px]'
            />
          </a>
          
          {/* Navigation Links */}
          <ul className='flex items-center gap-8 max-lg:hidden'>
            {navLinks.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className='font-montserrat leading-normal text-lg text-slate-gray hover:text-coral-red transition-colors'
                  onClick={() => {}}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Shopping Cart */}
          <Link to='/cart' className='font-montserrat leading-normal text-lg text-slate-gray hover:text-coral-red transition-colors max-lg:hidden relative'>
            Cart
            {cartCount > 0 && (
              <span className='absolute -top-2 -right-2 bg-coral-red text-white rounded-full text-xs px-2 min-w-[20px] h-5 flex items-center justify-center'>{cartCount}</span>
            )}
          </Link>
          
          {/* Orders - Only show if user is logged in */}
          {profile && (
            <Link to='/orders' className='font-montserrat leading-normal text-lg text-slate-gray hover:text-coral-red transition-colors max-lg:hidden'>
              Orders
            </Link>
          )}
          
          {/* Admin Panel - Only show if user is admin */}
          {isAdmin && (
            <Link to='/admin' className='font-montserrat leading-normal text-lg text-slate-gray hover:text-coral-red transition-colors max-lg:hidden'>
              Admin
            </Link>
          )}
        </div>
        
        {/* Right Side Elements */}
        <div className='flex items-center gap-6 text-lg leading-normal font-medium font-montserrat max-lg:hidden'>
          {profile ? (
            <div className='flex items-center gap-3'>
              <Link to='/profile' className='hover:opacity-80 transition-opacity'>
                <div className='w-8 h-8 rounded-full border bg-coral-red text-white flex items-center justify-center text-xs font-semibold'>
                  {profile.email ? profile.email.charAt(0).toUpperCase() : 'U'}
                </div>
              </Link>
              <span className='text-slate-gray'>{profile.email}</span>
              <button
                className='px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 text-sm font-semibold transition-colors'
                onClick={() => dispatch(logout())}
              >
                Log out
              </button>
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <Link to='/auth' className='hover:text-coral-red transition-colors'>Sign in</Link>
              <span className='text-slate-gray'>/</span>
              <Link to='/auth' className='hover:text-coral-red transition-colors'>Register</Link>
            </div>
          )}
        </div>
        
        {/* Mobile Menu */}
        <div className='hidden max-lg:block flex-shrink-0'>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='p-2'
          >
            <img src={hamburger} alt='hamburger icon' width={25} height={25} />
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className='lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50'>
          <div className='bg-white p-6 absolute top-0 right-0 w-64 h-full'>
            <div className='flex justify-between items-center mb-6'>
              <h3 className='text-lg font-semibold'>Menu</h3>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                ✕
              </button>
            </div>
            
            <div className='space-y-4'>
              {/* Navigation Links */}
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className='block font-montserrat text-lg text-slate-gray hover:text-coral-red transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Cart */}
              <Link 
                to='/cart' 
                className='block font-montserrat text-lg text-slate-gray hover:text-coral-red transition-colors relative'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cart
                {cartCount > 0 && (
                  <span className='ml-2 bg-coral-red text-white rounded-full text-xs px-2 py-1'>{cartCount}</span>
                )}
              </Link>
              
              {/* Orders - Only show if user is logged in */}
              {profile && (
                <Link 
                  to='/orders' 
                  className='block font-montserrat text-lg text-slate-gray hover:text-coral-red transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Orders
                </Link>
              )}
              
              {/* Admin Panel - Only show if user is admin */}
              {isAdmin && (
                <Link 
                  to='/admin' 
                  className='block font-montserrat text-lg text-slate-gray hover:text-coral-red transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              
              {/* User Section */}
              <div className='border-t pt-4'>
                {profile ? (
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 rounded-full border bg-coral-red text-white flex items-center justify-center text-xs font-semibold'>
                        {profile.email ? profile.email.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className='text-slate-gray'>{profile.email}</span>
                    </div>
                    <Link 
                      to='/profile' 
                      className='block font-montserrat text-lg text-slate-gray hover:text-coral-red transition-colors'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      className='w-full text-left font-montserrat text-lg text-slate-gray hover:text-coral-red transition-colors'
                      onClick={() => {
                        dispatch(logout());
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className='space-y-2'>
                    <Link 
                      to='/auth' 
                      className='block font-montserrat text-lg text-slate-gray hover:text-coral-red transition-colors'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link 
                      to='/auth' 
                      className='block font-montserrat text-lg text-slate-gray hover:text-coral-red transition-colors'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;

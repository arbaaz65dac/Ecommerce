import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../slices/authSlice';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(e.target);
    const credentials = Object.fromEntries(form.entries());
    
    try {
      if (isLogin) {
        const result = await dispatch(login(credentials)).unwrap();
        if (result) {
          setShowSuccessPopup(true);
          setTimeout(() => {
            setShowSuccessPopup(false);
            navigate('/');
          }, 2000);
        }
      } else {
        const result = await dispatch(signup(credentials)).unwrap();
        if (result) {
          setShowSuccessPopup(true);
          setTimeout(() => {
            setShowSuccessPopup(false);
            navigate('/');
          }, 2000);
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-white flex justify-center items-center px-4">
      <div className="max-w-md w-full shadow-xl rounded-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-palanquin font-bold text-center mb-6 text-coral-red">
          {isLogin ? 'Login' : 'Create Account'}
        </h2>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              isLogin ? 'border-coral-red text-coral-red' : 'border-transparent text-gray-400'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              !isLogin ? 'border-coral-red text-coral-red' : 'border-transparent text-gray-400'
            }`}
          >
            Signup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-montserrat">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-red"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-red"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-red"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 bg-coral-red text-white py-3 rounded-full hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        {auth.error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {auth.error}
          </div>
        )}

        {showSuccessPopup && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            ✅ Registration successful! Redirecting to login...
          </div>
        )}

        {isLogin && (
          <p className="mt-4 text-center text-sm text-slate-gray">
            Don't have an account?{' '}
            <button onClick={() => setIsLogin(false)} className="text-coral-red font-semibold">
              Sign Up
            </button>
          </p>
        )}

        {!isLogin && (
          <p className="mt-4 text-center text-sm text-slate-gray">
            Already have an account?{' '}
            <button onClick={() => setIsLogin(true)} className="text-coral-red font-semibold">
              Login
            </button>
          </p>
        )}
      </div>
    </section>
  );
};

export default Auth;

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';
import AdminSlots from './AdminSlots';
import AdminDiscounts from './AdminDiscounts';
import AdminOrders from './AdminOrders';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [nearFullSlots, setNearFullSlots] = useState([]);
  const authState = useSelector(state => state.auth);
  const navigate = useNavigate();

  // Check if user is admin
  React.useEffect(() => {
    if (!authState.profile || authState.profile.role !== 'ADMIN') {
      navigate('/');
      return;
    }
  }, [authState.profile, navigate]);

  // Fetch near-full slots for notification
  React.useEffect(() => {
    if (authState.profile?.token) {
      fetchNearFullSlots();
    }
  }, [authState.profile?.token]);

  const fetchNearFullSlots = async () => {
    try {
      const response = await fetch('http://localhost:8085/tricto/slots/near-full', {
        headers: {
          'Authorization': `Bearer ${authState.profile?.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNearFullSlots(data);
      }
    } catch (error) {
      console.error('Error fetching near-full slots:', error);
    }
  };

  if (!authState.profile || authState.profile.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'products', name: 'Products', icon: '📦' },
    { id: 'categories', name: 'Categories', icon: '🏷️' },
    { id: 'slots', name: 'Slots', icon: '🎯', notification: nearFullSlots.length },
    { id: 'discounts', name: 'Discounts', icon: '💰' },
    { id: 'orders', name: 'Orders', icon: '📋' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <AdminProducts />;
      case 'categories':
        return <AdminCategories />;
      case 'slots':
        return <AdminSlots />;
      case 'discounts':
        return <AdminDiscounts />;
      case 'orders':
        return <AdminOrders />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Tricto Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {authState.profile?.name || 'Admin'}
              </span>
              <button
                onClick={() => navigate('/')}
                className="bg-coral-red text-white px-4 py-2 rounded-lg hover:bg-coral-red/80 transition-colors"
              >
                Back to Site
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-coral-red text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
                {tab.notification && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {tab.notification}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [nearFullSlots, setNearFullSlots] = useState([]);
  const authState = useSelector(state => state.auth);

  React.useEffect(() => {
    // Fetch dashboard stats
    fetchDashboardStats();
    fetchNearFullSlots();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // This would be replaced with actual API calls
      setStats({
        totalProducts: 150,
        totalCategories: 12,
        totalOrders: 45,
        totalRevenue: 125000,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchNearFullSlots = async () => {
    try {
      const response = await fetch('http://localhost:8085/tricto/slots/near-full', {
        headers: {
          'Authorization': `Bearer ${authState.profile?.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNearFullSlots(data);
      }
    } catch (error) {
      console.error('Error fetching near-full slots:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Dashboard Overview</h2>
      
      {/* Near Full Slots Alert */}
      {nearFullSlots.length > 0 && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-orange-800">
                {nearFullSlots.length} slot{nearFullSlots.length > 1 ? 's' : ''} near full capacity
              </h3>
              <div className="mt-2 text-sm text-orange-700">
                <p>These slots are within 5 items of their maximum capacity and may need to be reset soon.</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('slots')}
              className="ml-4 bg-orange-100 text-orange-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-orange-200 transition-colors"
            >
              View Slots
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Products</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🏷️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Categories</p>
              <p className="text-2xl font-bold text-green-900">{stats.totalCategories}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Total Orders</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Revenue</p>
              <p className="text-2xl font-bold text-purple-900">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Order #12345</span>
              <span className="text-sm font-medium text-green-600">₹2,500</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Order #12344</span>
              <span className="text-sm font-medium text-green-600">₹1,800</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Order #12343</span>
              <span className="text-sm font-medium text-green-600">₹3,200</span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">Database</span>
              <span className="text-sm font-medium text-green-600">✅ Online</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">API Server</span>
              <span className="text-sm font-medium text-green-600">✅ Running</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="text-sm font-medium text-blue-600">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin; 
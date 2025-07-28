// zabox-web-app/api/api.js

// Base URL للـ Backend
const API_BASE_URL = 'http://localhost:5000/api';

// دوال مساعدة للتعامل مع الـ API
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      // لو في توكن، نضيفه للـ header
      ...(localStorage.getItem('token') && {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    throw error;
  }
};

// Auth APIs
export const registerUser = (userData) => apiRequest('/auth/register', {
  method: 'POST',
  body: JSON.stringify(userData)
});

export const loginUser = (credentials) => apiRequest('/auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials)
});

// Vendor APIs
export const getVendors = () => apiRequest('/vendors');

// Order APIs
export const createOrder = (orderData) => apiRequest('/orders', {
  method: 'POST',
  body: JSON.stringify(orderData)
});

export const getMyOrders = () => apiRequest('/orders/myorders');

// Driver APIs
export const getDrivers = () => apiRequest('/drivers');

// دوال للتعامل مع التوكن
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // npm install axios

const Login = ({ setIsAuthenticated, setUser }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Sending request to your Node.js backend
      const response = await axios.post('https://realstate-41cq.onrender.com/api/auth/login', formData);
      
      // ✅ UPDATED: Storing full user object for Role and Blocked status
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // 🔥 Pura user object save kiya
      
      // ✅ App.js ki states update karne ke liye
      if (setIsAuthenticated) setIsAuthenticated(true);
      if (setUser) setUser(response.data.user);
      
      alert("Login Successful!");
      navigate('/'); // Go to Home
    } catch (err) {
      // ✅ Blocked user handle karne ke liye alert
      const errorMsg = err.response?.data?.message || "Login Failed";
      alert(errorMsg);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-8">Login to manage your properties</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="name@example.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 shadow-lg"
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account? {' '}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">Register Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
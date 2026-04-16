import React, { useState } from 'react';
import API from '../api';
import { Mail, Lock, User, Phone, ShieldCheck } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: 'casual' });
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Signup Request (Sends OTP)
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Email ko hamesha lowercase mein bhejein taaki mismatch na ho
      const dataToSend = { ...formData, email: formData.email.toLowerCase().trim() };
      const { data } = await API.post('/auth/register', dataToSend);
      alert(data.message);
      setShowOtp(true);
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // 2. OTP Verification Request
  const handleVerify = async (e) => {
    e.preventDefault();
    
    // Debugging: Inspect console to see what is being sent
    console.log("Verifying Email:", formData.email);
    console.log("Verifying OTP:", otp);

    if (!otp || otp.length < 6) {
      return alert("Please enter a 6-digit OTP");
    }

    try {
      const { data } = await API.post('/auth/verify-otp', { 
        email: formData.email.toLowerCase().trim(), 
        otp: String(otp).trim() // Ensure OTP is a string
      });

      localStorage.setItem('token', data.token);
      alert("Verification Successful!");
      window.location.href = "/"; // Redirect to Home/Dashboard
    } catch (err) {
      // Backend se exact error message dikhayega (Invalid ya Expired)
      alert(err.response?.data?.message || "Verification failed");
      console.log("Error details:", err.response?.data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        {!showOtp ? (
          <form onSubmit={handleSignup} className="space-y-5">
            <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">Create Account</h2>
            
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input type="text" placeholder="Full Name" required className="w-full pl-10 p-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input type="email" placeholder="Email Address" required className="w-full pl-10 p-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input type="text" placeholder="Phone Number" required className="w-full pl-10 p-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input type="password" placeholder="Password" required className="w-full pl-10 p-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>

            <select className="w-full p-3 bg-gray-50 rounded-xl outline-none border-none text-gray-600 font-medium" 
              onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="casual">I want to Buy/Rent</option>
              <option value="professional">I am a Professional/Agent</option>
            </select>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-all transform active:scale-95 shadow-lg shadow-blue-100">
              {loading ? "Sending OTP..." : "Get Started"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6 text-center">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="text-blue-600" size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Check your Email</h2>
              <p className="text-gray-500 mt-1">We've sent a code to <br/> <span className="font-semibold text-gray-700">{formData.email}</span></p>
            </div>
            
            <input 
              type="text" 
              maxLength="6"
              placeholder="· · · · · ·" 
              className="w-full text-center text-3xl tracking-[12px] font-bold p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none transition-all" 
              onChange={(e) => setOtp(e.target.value)} 
            />

            <div className="space-y-3">
              <button type="submit" className="w-full bg-green-600 text-white p-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-100">
                Verify & Register
              </button>
              <button type="button" onClick={() => setShowOtp(false)} className="text-sm text-gray-500 hover:text-blue-600 font-medium">
                ← Edit Email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import PublicRoute from '@/components/PublicRoute'; // import the wrapper

const SignupPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post('https://campusconnect-ki0p.onrender.com/api/user/register/', formData);
      setSuccess(true);
      setMessage('✅ Signup successful! Redirecting to login... 😄');
      setTimeout(() => router.push('/login'), 3000);
    } catch (error) {
      console.error("Signup failed:", error.response?.data);
      if (
        error.response?.data?.email?.[0]?.includes('already exists') ||
        error.response?.data?.username?.[0]?.includes('already exists')
      ) {
        setMessage('❌ Email or username already exists. Please use different credentials.');
      } else {
        setMessage('❌ Signup failed. Please check your inputs.');
      }
      setLoading(false);
    }
  };

  return (
    <PublicRoute>
    <div className="min-h-screen bg-gradient-to-br from-[#2e026d] via-[#6c22bd] to-[#8b5cf6] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl text-white transition-transform duration-300 hover:scale-[1.015] hover:shadow-purple-800/40">
        <h2 className="text-3xl font-bold text-center mb-6">Create Your Account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm mb-1">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter your first name"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            <p className="text-xs text-purple-200 mt-1">👤 First name only.</p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm mb-1">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm mb-1">Password</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Choose a strong password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 pr-10 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-purple-300 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading && (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            )}
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>

          {message && (
            <p className={`text-sm text-center mt-3 ${success ? 'text-green-300' : 'text-red-200'}`}>
              {message}
            </p>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-purple-200 space-y-1">
          <p>Already have an account? <a href="/Auth/login" className="underline hover:text-white transition">Log In</a></p>
          <p>Need help? <a href="/support" className="underline hover:text-white transition">Contact Support</a></p>
        </div>
      </div>
    </div>
    </PublicRoute>
  );
};

export default SignupPage;
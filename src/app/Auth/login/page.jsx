'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/Authcontext/Authcontext';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSuccess(false);

    try {
      const ok = await login(formData.username, formData.password);
      if (ok) {
        setSuccess(true);
        setMessage('✔️ Login successful! Redirecting...');
        setTimeout(() => {
          setLoading(false);
          router.push('/');
        }, 1500);
      }
    } catch (error) {
      setMessage('❌ Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f051d] via-[#27125a] to-[#471f85] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-2xl shadow-xl text-white transition-transform transform hover:scale-105 duration-300">
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-3 cursor-pointer text-sm text-purple-200 hover:text-purple-100"
            >
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading && (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            )}
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          {message && (
            <p className={`text-center mt-3 text-sm ${success ? 'text-green-300' : 'text-red-200'}`}>
              {message}
            </p>
          )}
        </form>

        <div className="mt-6 text-sm text-purple-200 text-center space-y-1">
          {/*
          <p>
            Don&apos;t have an account?{' '}
            <a href="/Auth/signup" className="underline hover:text-white transition">
              Create Account
            </a>
          </p>
          */}
          <p>
            Forgot password?{' '}
            <a href="/reset-password" className="underline hover:text-white transition">
              Reset Here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
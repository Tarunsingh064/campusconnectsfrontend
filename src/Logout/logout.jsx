'use client';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/Authcontext/Authcontext';

export default function LogoutButton() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    setLoading(true);
    const token = Cookies.get('access_token');

    if (!token) {
      logout();
      return;
    }

    try {
      const response = await fetch('https://campusconnect-ki0p.onrender.com/api/user/logout/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok || response.status === 401) {
        logout();
      } else {
        const data = await response.json();
        alert(`Logout failed: ${data.detail || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Logout error: ' + error.message);
      logout();
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <span className="text-white">Logging out...</span>
        </div>
      ) : showConfirm ? (
        <div className="flex space-x-2">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Confirm Logout
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white px-6 py-2 text-lg rounded-full font-semibold hover:opacity-90 transition"
        >
          Logout
        </button>
      )}
    </>
  );
}
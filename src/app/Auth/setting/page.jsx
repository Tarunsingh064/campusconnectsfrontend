'use client';
import React, { useState } from 'react';
import SettingsForm from '@/app/Auth/SettingForm/page';
import PortfolioSection from '@/components/PortfolioSection';
import { useAuth } from '@/Authcontext/Authcontext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LogoutButton from '@/Logout/logout';

function SettingsPage() {
  const { user, logout } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-black text-white font-inter flex flex-col lg:flex-row">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full lg:w-80 bg-white/5 backdrop-blur-lg border-b lg:border-b-0 lg:border-r border-gray-700 shadow-xl p-6 flex flex-col justify-between"
      >
        <div>
          <h2 className="text-2xl lg:text-3xl font-semibold mb-8 text-yellow-400">
            Userbio Settings
          </h2>

          <div className="space-y-5">
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 transition font-semibold text-white shadow-lg"
            >
              {showForm ? 'Hide Form' : 'Userbio'}
            </button>

            <LogoutButton />
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto"
      >
        <div className="max-w-5xl mx-auto">
          {showForm ? <SettingsForm /> : <PortfolioSection />}
        </div>
      </motion.main>
    </div>
  );
}

export default SettingsPage;
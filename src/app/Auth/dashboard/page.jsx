'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import PostsFeed from '@/components/Postfeed';

export default function Page() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Feed'); // State to track selected tab

  const sidebarVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0 },
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Feed':
        return <PostsFeed />;
      // Future: case 'Teams': return <Teams />;
      default:
        return <p className="text-white">Select a section from the sidebar</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans overflow-x-hidden relative">
      {/* Topbar */}
      <div className="w-full bg-black/30 backdrop-blur-md shadow-md px-4 sm:px-6 md:px-10 py-4 flex items-center justify-between gap-4 text-sm sm:text-base z-50 relative">
        {/* Mobile menu button */}
        <button
          className="block lg:hidden p-2 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <input
          type="text"
          placeholder="Search students, projects, hackathons..."
          className="w-full px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sidebarVariants}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 z-40 w-64 h-full bg-white/10 backdrop-blur-md shadow-xl p-6 space-y-8 text-white"
          >
            <h2 className="text-2xl font-bold text-purple-400">DevConnect</h2>

            <ul className="space-y-4 text-base font-medium">
              <li
                className={`cursor-pointer ${activeTab === 'Feed' ? 'text-purple-300' : 'hover:text-white'} transition`}
                onClick={() => {
                  setActiveTab('Feed');
                  setSidebarOpen(false); // Close on mobile after selecting
                }}
              >
                Feed
              </li>
              <li className="hover:text-white transition">Find Teams</li>
              <li className="hover:text-white transition">Alumni Connect</li>
              <li className="hover:text-white transition">Messages</li>
              <li className="hover:text-white transition">Mentorship</li>
            </ul>

            <Link
              href="/Auth/setting"
              className="block text-purple-300 hover:text-white transition text-base"
            >
              ⚙️ Settings
            </Link>

            <div className="mt-10 p-6 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-2xl text-center shadow-lg">
              <p className="text-lg font-semibold">Weekly Challenge</p>
              <button className="mt-4 px-4 py-2 bg-white text-purple-700 font-semibold rounded-lg shadow-md hover:scale-105 transition">
                Join Challenge
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-1/4 p-6 space-y-10 bg-white/10 backdrop-blur-sm text-white shadow-inner rounded-tr-3xl rounded-br-3xl">
          <h2 className="text-3xl font-bold text-purple-400">DevConnect</h2>

          <ul className="space-y-4 text-lg font-medium">
            <li
              className={`cursor-pointer ${activeTab === 'Feed' ? 'text-purple-300' : 'hover:text-white'} transition`}
              onClick={() => setActiveTab('Feed')}
            >
              Feed
            </li>
            <li className="hover:text-white transition">Find Teams</li>
            <li className="hover:text-white transition">Alumni Connect</li>
            <li className="hover:text-white transition">Messages</li>
            <li className="hover:text-white transition">Mentorship</li>
          </ul>

          <Link
            href="/Auth/setting"
            className="block text-purple-300 hover:text-white transition text-lg"
          >
            ⚙️ Settings
          </Link>

          <div className="mt-10 p-6 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-2xl text-center shadow-lg">
            <p className="text-xl font-semibold">Weekly Challenge</p>
            <button className="mt-4 px-4 py-2 bg-white text-purple-700 font-semibold rounded-lg shadow-md hover:scale-105 transition">
              Join Challenge
            </button>
          </div>
        </aside>

        {/* Middle Content */}
        <main className="w-full lg:w-2/4 px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {renderContent()}
          </motion.div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block lg:w-1/4 p-6 space-y-8 bg-white/10 backdrop-blur-sm text-white shadow-inner rounded-tl-3xl rounded-bl-3xl">
          {/* Alumni Spotlight */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-purple-300">Alumni Spotlight</h3>
            <div className="space-y-4 text-base">
              <div>
                <p className="font-semibold text-white">David Kim</p>
                <p className="text-gray-400">Software Engineer at Google<br />Class of 2019</p>
              </div>
              <div>
                <p className="font-semibold text-white">Lisa Zhang</p>
                <p className="text-gray-400">Product Manager at Meta<br />Class of 2020</p>
              </div>
              <button className="mt-4 text-purple-300 font-medium hover:underline">
                View All Alumni
              </button>
            </div>
          </div>

          {/* Trending Tech */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-purple-300">Trending Tech</h3>
            <ul className="space-y-2 text-gray-200 text-base">
              <li>React <span className="text-green-400 ml-2">+15%</span></li>
              <li>Python <span className="text-green-400 ml-2">+12%</span></li>
              <li>Next.js <span className="text-green-400 ml-2">+20%</span></li>
              <li>TypeScript <span className="text-green-400 ml-2">+18%</span></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

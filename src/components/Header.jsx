'use client';
import Link from 'next/link';
import { FiLogIn } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { useAuth } from '../Authcontext/Authcontext';
import LogoutButton from '@/Logout/logout';
import { AnimatePresence, motion } from 'framer-motion';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="w-full bg-gradient-to-r from-[#0f172a] to-[#1e1b4b] px-6 md:px-16 py-4 shadow-md">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-purple-500 shadow-md border border-purple-400" />
          <span className="text-white font-bold text-xl">
            Campus<span className="text-cyan-400">Connect</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center justify-between w-full px-8">
          <div className="flex-1 flex justify-center gap-8">
            <Link href="/" className="text-white font-medium hover:text-cyan-400 border-b-2 border-cyan-400 pb-1">
              Home
            </Link>
            <Link href="/projects" className="text-gray-400 hover:text-white transition">
              Projects
            </Link>
            <Link href="/about" className="text-gray-400 hover:text-white transition">
              About
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              // Logged-in: Avatar dropdown
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg cursor-pointer shadow-lg border-2 border-white/20"
                >
                  {user.username?.charAt(0)?.toUpperCase() || 'U'}
                </motion.div>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="absolute right-0 mt-3 w-52 rounded-2xl shadow-2xl bg-gradient-to-br from-[#1f2937] to-[#111827] text-white ring-1 ring-white/10 backdrop-blur-xl p-3 z-50"
                    >
                      <Link
                        href="/Auth/dashboard"
                        className="block px-4 py-2 mb-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 transition text-sm text-white font-semibold text-center shadow-sm"
                      >
                        Dashboard
                      </Link>

                      <div className="px-4 py-2 rounded-xl hover:bg-gray-700/60 text-sm cursor-pointer transition text-center font-medium">
                        <LogoutButton />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/Auth/login"
                  className="flex items-center gap-1 text-white px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition"
                >
                  <FiLogIn />
                  Log In
                </Link>
                <Link
                  href="/Auth/Signup"
                  className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition"
                >
                  <FaUser />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          <Link href="/" className="text-white hover:text-cyan-400">Home</Link>
          <Link href="/projects" className="text-white hover:text-cyan-400">Projects</Link>
          <Link href="/about" className="text-white hover:text-cyan-400">About</Link>

          {user ? (
            <>
              <Link href="/Auth/dashboard" className="text-white bg-cyan-800 px-3 py-2 rounded hover:bg-cyan-900">
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/Auth/login"
                className="text-white border border-gray-600 px-3 py-2 rounded hover:bg-gray-800 flex items-center gap-2"
              >
                <FiLogIn />
                Log In
              </Link>
              <Link
                href="/Auth/Signup"
                className="bg-blue-900 text-white px-3 py-2 rounded hover:bg-purple-600 flex items-center gap-2"
              >
                <FaUser />
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuth } from '@/Authcontext/Authcontext';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function PortfolioSection() {
  const { user } = useAuth();
  const [bio, setBio] = useState(null);

  useEffect(() => {
    const fetchBio = async () => {
      try {
        const res = await axios.get('https://campusconnect-ki0p.onrender.com/api/userbio/portfolio/', {
          headers: {
            Authorization: `Bearer ${Cookies.get('access_token')}`,
          },
        });
        setBio(res.data);
      } catch (err) {
        console.error('Error loading bio:', err);
      }
    };

    if (user?.username) fetchBio();
  }, [user]);

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[400px] h-[80vh] bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6366f1]/20 via-transparent to-[#ec4899]/20 blur-[2px] pointer-events-none" />

        <div className="relative z-10 space-y-5 h-full overflow-y-auto custom-scroll text-white">
          {/* Username and Profile Image */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold break-words">{user?.username}</h2>
            <p className="text-sm text-gray-400">User Portfolio</p>
          </div>

          <div className="flex justify-center">
            <div className="w-24 h-24 relative rounded-full overflow-hidden border-4 border-[#6366f1] shadow-md">
              <Image
                src={user?.profileImage || '/placeholder-user.png'}
                alt="Profile Image"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Bio Data */}
          <div className="space-y-4 text-sm">
            <InfoRow label="Email" value={user?.email} />
            <InfoRow label="Bio" value={bio?.bio} scrollable />
            <InfoRow label="College" value={bio?.college_name} />
            <InfoRow label="Year" value={bio?.college_year} />
            <InfoRow label="Location" value={bio?.location} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InfoRow({ label, value, scrollable = false }) {
  return (
    <div className="flex flex-col border-b border-white/10 pb-2">
      <span className="text-gray-400 text-xs mb-1">{label}</span>
      {scrollable ? (
        <div className="max-h-24 overflow-y-auto text-xs p-2 bg-white/5 rounded-md whitespace-pre-wrap break-words custom-scroll">
          {value || '—'}
        </div>
      ) : (
        <span className="text-sm font-medium text-white break-words overflow-hidden">{value || '—'}</span>
      )}
    </div>
  );
}
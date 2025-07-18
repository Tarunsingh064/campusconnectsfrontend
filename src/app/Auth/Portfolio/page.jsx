'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Portfolio() {
  const [portfolios, setPortfolios] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState('https://campusconnect-ki0p.onrender.com/api/userbio/portfolio/port/');
  const [loading, setLoading] = useState(false);

  const fetchPortfolios = async () => {
    if (!nextPageUrl) return;

    setLoading(true);
    try {
      const res = await axios.get(nextPageUrl);
      setPortfolios(prev => [...prev, ...res.data.results]); // Append new results
      setNextPageUrl(res.data.next); // Update to next page URL (or null)
    } catch (err) {
      console.error('Error fetching portfolios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios(); // Fetch first page on mount
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] py-10 px-4 flex flex-wrap gap-6 justify-center">
      {portfolios.map((bio, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="w-[340px] bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6 relative overflow-hidden text-white"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6366f1]/20 via-transparent to-[#ec4899]/20 blur-[2px] pointer-events-none" />
          <div className="relative z-10 space-y-5 h-full overflow-y-auto custom-scroll">
            {/* Username + Email */}
            <div className="text-center">
              <h2 className="text-xl font-semibold break-words">{bio.user?.username}</h2>
              <p className="text-xs text-gray-400">{bio.user?.email}</p>
            </div>

            {/* Media (Image or Fallback) */}
            <div className="flex justify-center">
              <div className="w-24 h-24 relative rounded-full overflow-hidden border-4 border-[#6366f1] shadow-md">
                <img
                  src={bio?.media || '/placeholder-user.png'}
                  alt="Media"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="space-y-4 text-sm">
              <InfoRow label="Bio" value={bio?.bio} scrollable />
              <InfoRow label="College" value={bio?.college_name} />
              <InfoRow label="Year" value={bio?.college_year} />
              <InfoRow label="Location" value={bio?.location} />
            </div>
          </div>
        </motion.div>
      ))}

      {/* Load More */}
      {nextPageUrl && !loading && (
        <button
          onClick={fetchPortfolios}
          className="w-full max-w-xs mt-8 bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl"
        >
          Load More
        </button>
      )}
      {loading && <p className="text-white mt-4">Loading...</p>}
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

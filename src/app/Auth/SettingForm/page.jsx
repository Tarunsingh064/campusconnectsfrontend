'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function SettingsForm() {
  const [form, setForm] = useState({
    bio: '',
    college_name: '',
    college_year: '',
    location: '',
  });

  const [media, setMedia] = useState(null); // ✅ file
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [bioExists, setBioExists] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserBio = async () => {
      try {
        const res = await axios.get('https://campusconnect-ki0p.onrender.com/api/userbio/portfolio/', {
          headers: {
            Authorization: `Bearer ${Cookies.get('access_token')}`,
          },
        });
        setForm(res.data);
        setBioExists(true);
      } catch (err) {
        console.warn('Bio not found. Switching to create mode.');
        setBioExists(false);
      }
    };

    fetchUserBio();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setMedia(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    if (media) {
      formData.append('media', media); // ✅ Add media file
    }

    try {
      const url = 'https://campusconnect-ki0p.onrender.com/api/userbio/portfolio/';
      const url1 = 'https://campusconnect-ki0p.onrender.com/api/userbio/portfolio/create/';
      const method = bioExists ? axios.put : axios.post;
      const useurl = bioExists ?url :url1;
      await method(useurl, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMsg(bioExists ? 'Updated successfully!' : 'Created successfully!');
      if (!bioExists) {
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    } catch (err) {
      console.error('Submit failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-black rounded-3xl shadow-2xl border border-zinc-800">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-zinc-900 text-white p-8 rounded-2xl shadow-xl space-y-6 border border-zinc-800"
        encType="multipart/form-data"
      >
        <h2 className="text-3xl font-bold text-white mb-4 text-center">
          {bioExists ? '⚙️ Edit Your Bio' : '🆕 Create Your Bio'}
        </h2>

        {['bio', 'college_name', 'college_year', 'location'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-zinc-400 capitalize mb-2">
              {field.replace('_', ' ')}
            </label>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
            />
          </div>
        ))}

        {/* ✅ File Upload */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Upload Media (image/video)</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 rounded-xl bg-zinc-800 text-white border border-zinc-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-black hover:file:bg-yellow-300 transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${bioExists ? 'bg-yellow-500' : 'bg-green-500'} text-black font-semibold py-2 rounded-xl hover:brightness-110 transition-all duration-200`}
        >
          {loading
            ? bioExists
              ? 'Updating...'
              : 'Creating...'
            : bioExists
            ? 'Update Bio'
            : 'Create Bio'}
        </button>

        {successMsg && (
          <p className="text-green-400 font-medium mt-2 animate-pulse text-center">{successMsg}</p>
        )}
      </form>
    </div>
    
  );
}

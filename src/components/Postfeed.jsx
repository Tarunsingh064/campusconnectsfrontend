'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const PostsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://campusconnect-ki0p.onrender.com/api/post/posts/');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!text && !media) {
      alert("Please add text or media.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('text', text);
    if (media) formData.append('media', media);

    try {
      const res = await fetch('https://campusconnect-ki0p.onrender.com/api/post/posts/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`,
        },
        body: formData,
      });

      if (res.ok) {
        const newPost = await res.json();
        setPosts([newPost, ...posts]);
        setText('');
        setMedia(null);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('Create post failed:', res.status, errorData);
        alert(`Failed to create post: ${res.status}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Network error while creating post.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`https://campusconnect-ki0p.onrender.com/api/post/posts/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`,
        },
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((post) => post.id !== id));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id, newText) => {
    try {
      const res = await fetch(`https://campusconnect-ki0p.onrender.com/api/post/posts/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('access_token')}`,
        },
        body: JSON.stringify({ text: newText }),
      });
      if (res.ok) {
        const updatedPost = await res.json();
        setPosts((prev) => prev.map((post) => (post.id === id ? updatedPost : post)));
      }
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const PostCard = ({ post }) => {
    const isOwner = user?.username === post.owner;
    const isImage = post.media?.endsWith('.jpg') || post.media?.endsWith('.png') || post.media?.endsWith('.jpeg') || post.media?.endsWith('.webp');
    const isVideo = post.media?.endsWith('.mp4') || post.media?.endsWith('.webm');
    const firstLetter = post.owner?.charAt(0)?.toUpperCase();

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-5 shadow-md space-y-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 text-white rounded-full flex items-center justify-center font-bold text-lg">
            {firstLetter}
          </div>
          <div className="truncate">
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{post.owner}</h2>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>

        {post.text && (
          <p className="text-sm sm:text-base text-gray-800 dark:text-gray-100 break-words">{post.text}</p>
        )}

        {post.media && (
          <div className="rounded-lg overflow-hidden">
            {isImage ? (
              <img src={post.media} alt="Post media" className="w-full h-auto rounded-md max-h-[300px] object-cover" />
            ) : isVideo ? (
              <video controls className="w-full rounded-md max-h-[300px]">
                <source src={post.media} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p className="text-xs text-gray-400">Unsupported media</p>
            )}
          </div>
        )}

        {isOwner && (
          <div className="flex gap-2 text-sm">
            <button onClick={() => {
              const newText = prompt('Edit your post:', post.text);
              if (newText && newText !== post.text) handleEdit(post.id, newText);
            }} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">
              Edit
            </button>
            <button onClick={() => handleDelete(post.id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
              Delete
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6 pb-24"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-3 sm:p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow">
        <button
          onClick={fetchPosts}
          className="bg-gray-200 dark:bg-gray-700 text-sm px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          🔄 Refresh
        </button>
        {loading && <p className="text-blue-600 dark:text-blue-400 text-sm">Loading...</p>}
      </div>

      {/* Create Post */}
      <div className="p-3 sm:p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded resize-none text-sm sm:text-base"
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setMedia(e.target.files[0])}
          className="w-full text-sm"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>

      {/* Posts */}
      <div className="grid gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </motion.div>
  );
};

export default PostsFeed;

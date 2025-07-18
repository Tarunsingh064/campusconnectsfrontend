'use client';

import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { useAuth } from '@/Authcontext/Authcontext';

const PostsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const feedRef = useRef();
  const { user } = useAuth();

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = 0;
  }, [posts]);

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
    if (!text.trim() && !media) {
      alert('Please add some text or media to post.');
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
        const errData = await res.json();
        console.error('Failed to create post:', errData);
        alert('Post failed');
      }
    } catch (error) {
      console.error('Error creating post:', error);
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
      } else {
        console.error('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id, newText) => {
    if (!newText.trim()) {
      alert('Text cannot be empty.');
      return;
    }

    const formData = new FormData();
    formData.append('text', newText);

    try {
      const res = await fetch(`https://campusconnect-ki0p.onrender.com/api/post/posts/${id}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`,
        },
        body: formData,
      });

      if (res.ok) {
        const updatedPost = await res.json();
        setPosts((prev) => prev.map((post) => (post.id === id ? updatedPost : post)));
      } else {
        console.error('Edit failed', await res.json());
        alert('Edit failed');
      }
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const PostCard = ({ post }) => {
    const isOwner = user?.username === post.owner_username;
    const isImage = post.media?.match(/\.(jpeg|jpg|png|webp)$/);
    const isVideo = post.media?.match(/\.(mp4|webm)$/);

    const handleEditClick = () => {
      const newText = prompt('Edit your post:', post.text);
      if (newText && newText !== post.text) {
        handleEdit(post.id, newText);
      }
    };

    const handleDeleteClick = () => {
      if (confirm('Are you sure you want to delete this post?')) {
        handleDelete(post.id);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-md space-y-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
            <img
              src={`https://ui-avatars.com/api/?name=${post.owner_username}`}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">{post.owner_username}</h2>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>

        <p className="text-base text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{post.text}</p>

        {post.media && (
          <div className="rounded-lg overflow-hidden mt-2">
            {isImage ? (
              <img src={post.media} alt="Post media" className="w-full h-auto rounded-md" />
            ) : isVideo ? (
              <video controls className="w-full rounded-md">
                <source src={post.media} />
              </video>
            ) : (
              <p className="text-xs text-gray-400">Unsupported media</p>
            )}
          </div>
        )}

        {isOwner && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleEditClick}
              className="bg-yellow-500 text-white px-4 py-1.5 rounded-lg hover:bg-yellow-600 transition"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
            >
              🗑️ Delete
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
      className="flex flex-col gap-6 max-h-screen overflow-hidden"
    >
      {/* Refresh Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          onClick={fetchPosts}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-4 py-2 rounded-lg hover:brightness-110 transition"
        >
          🔄 Refresh
        </button>
        {loading && <span className="text-blue-600 dark:text-blue-400 text-sm">Loading...</span>}
      </div>

      {/* Create Form */}
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-lg p-6 space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="✍️ Share your thoughts..."
          className="w-full h-28 p-3 rounded-lg border border-gray-300 dark:border-gray-700 resize-none text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setMedia(e.target.files[0])}
          className="w-full text-sm text-gray-700 dark:text-gray-300"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Posting...' : '🚀 Post'}
        </button>
      </div>

      {/* Posts Feed */}
      <div
        ref={feedRef}
        className="flex-1 overflow-y-auto pr-2 max-h-[65vh] grid gap-6"
      >
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </motion.div>
  );
};

export default PostsFeed;

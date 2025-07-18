'use client';

import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

const PostsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const feedRef = useRef();

  // Scroll to top on new post
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [posts]);

  // Fetch all posts
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

  // Create new post
  const handleCreate = async () => {
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

  // Delete post
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

  // Edit post
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
      } else {
        console.error('Edit failed');
      }
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const PostCard = ({ post }) => {
    const isImage = post.media?.endsWith('.jpg') || post.media?.endsWith('.png') || post.media?.endsWith('.jpeg') || post.media?.endsWith('.webp');
    const isVideo = post.media?.endsWith('.mp4') || post.media?.endsWith('.webm');

    const handleEditClick = () => {
      const newText = prompt('Edit your post:', post.text);
      if (newText && newText !== post.text) {
        handleEdit(post.id, newText);
      }
    };

    const handleDeleteClick = () => {
      handleDelete(post.id);
    };

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-md space-y-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
            <img src={`https://ui-avatars.com/api/?name=${post.owner.username}`} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">{post.owner.username}</h2>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{post.text}</p>

        {post.media && (
          <div className="rounded-lg overflow-hidden">
            {isImage ? (
              <img src={post.media} alt="Post media" className="w-full h-auto rounded-md" />
            ) : isVideo ? (
              <video controls className="w-full rounded-md">
                <source src={post.media} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p className="text-xs text-gray-400">Unsupported media</p>
            )}
          </div>
        )}

        <div className="flex gap-2 text-sm">
          <button onClick={handleEditClick} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">Edit</button>
          <button onClick={handleDeleteClick} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Delete</button>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Refresh */}
      <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow">
        <button
          onClick={fetchPosts}
          className="bg-gray-200 dark:bg-gray-700 text-sm px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          🔄 Refresh
        </button>
        {loading && <p className="text-blue-600 dark:text-blue-400 text-sm">Loading...</p>}
      </div>

      {/* Create Post Form */}
      <div className="p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded resize-none"
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setMedia(e.target.files[0])}
          className="w-full"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>

      {/* All Posts */}
      <div ref={feedRef} className="grid gap-4 max-h-[70vh] overflow-y-auto pr-2">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </motion.div>
  );
};

export default PostsFeed;

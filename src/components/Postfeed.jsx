'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { formatDistanceToNow } from 'date-fns';

const PostsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [media, setMedia] = useState(null);

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await fetch('https://campusconnect-ki0p.onrender.com/api/post/posts/');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  // Create new post
  const handleCreate = async () => {
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
        console.error('Create post failed');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  // Delete post
  const handleDelete = async (id) => {
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

  // PostCard component inside same file
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
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">{post.owner.username}</h2>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-800 dark:text-gray-100">{post.text}</p>

        {post.media && (
          <div className="rounded-lg overflow-hidden mt-2">
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

        <div className="flex gap-2 text-sm text-white">
          <button onClick={handleEditClick} className="bg-yellow-500 px-3 py-1 rounded">Edit</button>
          <button onClick={handleDeleteClick} className="bg-red-500 px-3 py-1 rounded">Delete</button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Create Post Form */}
      <div className="p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded mb-2"
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setMedia(e.target.files[0])}
          className="mb-2"
        />
        <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded">
          Post
        </button>
      </div>

      {/* All Posts */}
      <div className="overflow-y-auto max-h-[600px] divide-y divide-gray-200 dark:divide-gray-700">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default PostsFeed;

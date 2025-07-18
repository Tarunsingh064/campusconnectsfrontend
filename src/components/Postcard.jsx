'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import Cookies from 'js-cookie';

const PostCard = ({ post, onDelete, onEdit }) => {
  const isImage = post.media?.endsWith('.jpg') || post.media?.endsWith('.png') || post.media?.endsWith('.jpeg') || post.media?.endsWith('.webp');
  const isVideo = post.media?.endsWith('.mp4') || post.media?.endsWith('.webm');

  const handleDelete = async () => {
    try {
      const res = await fetch(`https://campusconnect-ki0p.onrender.com/api/post/posts/${post.id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`,
        },
      });
      if (res.ok) {
        onDelete(post.id);
      } else {
        console.error('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEdit = () => {
    const newText = prompt('Edit your post:', post.text);
    if (newText && newText !== post.text) {
      onEdit(post.id, newText);
    }
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
        <button onClick={handleEdit} className="bg-yellow-500 px-3 py-1 rounded">Edit</button>
        <button onClick={handleDelete} className="bg-red-500 px-3 py-1 rounded">Delete</button>
      </div>
    </div>
  );
};

export default PostCard;
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
  const [showCreate, setShowCreate] = useState(false);
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
        setShowCreate(false);
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
  const isImage = post.media?.match(/\.(jpeg|jpg|png|webp)$/);
  const isVideo = post.media?.match(/\.(mp4|webm)$/);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const commentsRef = useRef(null);

  // Enhanced ownership check
  const isOwner = user?.id === post.owner || user?.username === post.owner_username;

  useEffect(() => {
    if (showComments && commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
    }
  }, [comments, showComments]);
  

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await fetch(
        `https://campusconnect-ki0p.onrender.com/api/post/posts/${post.id}/comments/`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('access_token')}`
          }
        }
      );
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`https://campusconnect-ki0p.onrender.com/api/post/posts/${postId}/like/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`
        }
      });
      
      if (res.ok) {
        const result = await res.json();
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId
              ? {
                  ...post,
                  is_liked: result.status === 'liked',
                  like_count: result.status === 'liked'
                    ? post.like_count + 1
                    : post.like_count - 1
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
  e.preventDefault();
  if (!commentText.trim()) return;

  try {
    const formData = new FormData();
    formData.append('text', commentText); // Explicitly convert to string

    const res = await fetch(
      `https://campusconnect-ki0p.onrender.com/api/post/posts/${post.id}/comment/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`
        },
        body: formData // Using FormData instead of JSON
      }
    );

    if (res.ok) {
      const newComment = await res.json();
      setComments([...comments, newComment]);
      setCommentText('');
      if (commentsRef.current) {
        commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
      }
    } else {
      const errorData = await res.json();
      console.error('Comment submission error:', errorData);
    }
  } catch (error) {
    console.error('Failed to post comment:', error);
  }
  
};
  const handleEditComment = async (id, newText) => {
    if (!newText.trim()) return;

    try {
      const res = await fetch(
        `https://campusconnect-ki0p.onrender.com/api/post/comments/${id}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('access_token')}`
          },
          body: JSON.stringify({ text: newText })
        }
      );

      if (res.ok) {
        const updatedComment = await res.json();
        setComments(comments.map(comment => 
          comment.id === id ? updatedComment : comment
        ));
      }
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  };

  const handleDeleteComment = async (id) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        const res = await fetch(
          `https://campusconnect-ki0p.onrender.com/api/post/comments/${id}/`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${Cookies.get('access_token')}`
            }
          }
        );

        if (res.ok) {
          setComments(comments.filter(comment => comment.id !== id));
        }
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  const toggleComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

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

  const getAvatarLetters = (username) => {
    if (!username) return 'US';
    return username.slice(0, 1).toUpperCase();
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/20"
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-purple-500/30 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src={`https://ui-avatars.com/api/?name=${post.owner_username}&background=7e22ce&color=fff`}
              alt="avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://ui-avatars.com/api/?name=User&background=random';
              }}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-white">{post.owner_username}</h2>
            <span className="text-gray-300">·</span>
            <p className="text-xs text-gray-300">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>

          <p className="text-gray-100 mt-1 mb-2 whitespace-pre-wrap">
            {post.text}
          </p>

          {post.media && (
            <div className="rounded-lg overflow-hidden mt-2 mb-2 max-h-48 bg-black/20 flex items-center justify-center">
              {isImage ? (
                <img 
                  src={post.media} 
                  alt="Post media" 
                  className="max-w-full max-h-full object-contain rounded-lg" 
                />
              ) : isVideo ? (
                <video 
                  controls 
                  className="max-w-full max-h-48 object-contain rounded-lg"
                >
                  <source src={post.media} />
                </video>
              ) : (
                <p className="text-xs text-gray-400">Unsupported media</p>
              )}
            </div>
          )}

          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-4">
              <button 
                 onClick={() => handleLike(post.id)}
                disabled={loadingLike}
                className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`heart-icon ${post.is_liked ? 'liked' : ''}`}
                  viewBox="0 0 20 20" 
                  fill={post.is_liked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                   
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                  />
                </svg>
                <span>{post.like_count}</span>
              </button>
              
              <button 
                onClick={toggleComments}
                className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                  />
                </svg>
                <span>{post.comment_count || 0}</span>
              </button>
            </div>

            {isOwner && (
              <div className="flex gap-4 text-sm">
                <button
                  onClick={handleEditClick}
                  className="text-purple-300 hover:text-white transition"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {showComments && (
            <div className="mt-4">
              <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 bg-white/5 border border-white/20 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button 
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700 transition disabled:bg-purple-800 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </form>

              <div 
                ref={commentsRef}
                className="max-h-48 overflow-y-auto pr-2 space-y-3"
                style={{ scrollbarWidth: 'thin' }}
              >
                {loadingComments ? (
                  <div className="flex justify-center py-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : comments.length > 0 ? (
                  comments.map(comment => {
                    const isCommentOwner = user?.id === comment.owner || user?.username === comment.owner_username;
                    const username = comment.owner_username || `User ${comment.owner}`;
                    
                    return (
                      <div key={comment.id} className="bg-white/5 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-purple-500/30 rounded-full overflow-hidden flex-shrink-0">
                              <img
                                src={`https://ui-avatars.com/api/?name=${getAvatarLetters(comment.owner_username)}&background=7e22ce&color=fff&size=64`}
                                alt="avatar"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-white">{comment.owner_username}</p>
                              <p className="text-xs text-gray-300">{comment.text}</p>
                            </div>
                          </div>
                          {isCommentOwner && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const newText = prompt('Edit comment:', comment.text);
                                  if (newText && newText !== comment.text) {
                                    handleEditComment(comment.id, newText);
                                  }
                                }}
                                className="text-xs text-purple-300 hover:text-white"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-sm text-gray-400 py-2">No comments yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

  return (
    <div className="flex flex-col h-full">
      {/* Header with Refresh and Create Post */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-md p-4 flex items-center justify-between border-b border-white/10 mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchPosts}
            className="p-2 rounded-full hover:bg-white/10 transition"
            title="Refresh"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm font-medium transition"
          >
            {showCreate ? 'Cancel' : 'New Post'}
          </button>
        </div>
      </div>

      {/* Create Post Form */}
      {showCreate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden mb-4"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows="3"
            />
            <div className="flex justify-between items-center mt-3">
              <div>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setMedia(e.target.files[0])}
                  className="hidden"
                  id="media-upload"
                />
                <label
                  htmlFor="media-upload"
                  className="p-2 rounded-full hover:bg-white/10 transition cursor-pointer text-white"
                  title="Add media"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </label>
                {media && (
                  <span className="ml-2 text-sm text-gray-300">
                    {media.name}
                  </span>
                )}
              </div>
              <button
                onClick={handleCreate}
                disabled={loading || (!text.trim() && !media)}
                className={`px-4 py-2 rounded-full font-medium ${(!text.trim() && !media) || loading ? 'bg-purple-800 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white transition`}
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Posts Feed with Fixed Height */}
      <div 
        ref={feedRef} 
        className="flex-1 overflow-y-auto pr-2"
        style={{ 
          scrollbarWidth: 'thin',
          height: '600px',
          maxHeight: '600px'
        }}
      >
        {posts.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-300 h-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-center">No posts yet. Be the first to share something!</p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition text-sm"
            >
              Create a post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsFeed;
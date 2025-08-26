'use client';

import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { useAuth } from '@/Authcontext/Authcontext';
import axios from "axios";

const PostsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const feedRef = useRef();
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://campusconnect-ki0p.onrender.com/api/post/posts/', {
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`,
        },
      });
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
        setMediaPreview(null);
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

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview(null);
  };

  const PostCard = ({ post }) => {
    const isImage = post.media?.match(/\.(jpeg|jpg|png|webp|gif)$/i);
    const isVideo = post.media?.match(/\.(mp4|webm|mov)$/i);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    const [loadingLike, setLoadingLike] = useState(false);
    const [isLiked, setIsLiked] = useState(post.is_liked);
    const [likeCount, setLikeCount] = useState(post.like_count);
    const commentsRef = useRef(null);

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
      setLoadingLike(true);
      try {
        const response = await axios.post(
          `https://campusconnect-ki0p.onrender.com/api/post/posts/${postId}/like/`,
          {status:"liked"},
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("access_token")}`,
            },
          }
        );

        setIsLiked(response.data.status === "liked");
        setLikeCount(prev => response.data.status === "liked" ? prev + 1 : prev - 1);
        
        // Update the posts array to reflect the like change
        setPosts(prevPosts => prevPosts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              is_liked: response.data.status === "liked",
              like_count: response.data.status === "liked" ? p.like_count + 1 : p.like_count - 1
            };
          }
          return p;
        }));
      } catch (error) {
        console.error("Error liking post", error);
      } finally {
        setLoadingLike(false);
      }
    };

    const handleCommentSubmit = async (e) => {
      e.preventDefault();
      if (!commentText.trim()) return;

      try {
        const formData = new FormData();
        formData.append('text', commentText);

        const res = await fetch(
          `https://campusconnect-ki0p.onrender.com/api/post/posts/${post.id}/comment/`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${Cookies.get('access_token')}`
            },
            body: formData
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
        className="bg-white rounded-lg border border-gray-300 overflow-hidden w-full max-w-2xl mx-auto mb-6"
      >
        {/* Post Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              <img
                src={`https://ui-avatars.com/api/?name=${post.owner_username}&background=7e22ce&color=fff`}
                alt="avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://ui-avatars.com/api/?name=User&background=random';
                }}
              />
            </div>
            <div>
              <h2 className="font-semibold text-sm">{post.owner_username}</h2>
            </div>
          </div>
          {isOwner && (
            <div className="relative group">
              <button className="p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block border border-gray-200">
                <button
                  onClick={handleEditClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Post Media */}
        {post.media && (
          <div className="w-full aspect-square bg-black flex items-center justify-center">
            {isImage ? (
              <img 
                src={post.media} 
                alt="Post media" 
                className="w-full h-full object-contain" 
              />
            ) : isVideo ? (
              <video 
                controls 
                className="w-full h-full object-contain"
              >
                <source src={post.media} />
              </video>
            ) : (
              <p className="text-xs text-gray-400">Unsupported media</p>
            )}
          </div>
        )}

        {/* Post Actions */}
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-4">
              <button 
                onClick={() => handleLike(post.id)}
                disabled={loadingLike}
                className="focus:outline-none"
              >
                {isLiked ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ed4956" className="w-7 h-7">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                )}
              </button>
              <button 
                onClick={toggleComments}
                className="focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                </svg>
              </button>
              <button className="focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </button>
            </div>
            <button className="focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </button>
          </div>

          {/* Likes count */}
          {likeCount > 0 && (
            <div className="mb-1">
              <p className="text-sm font-semibold">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</p>
            </div>
          )}

          {/* Post Text */}
          <div className="mb-2">
            <p className="text-sm">
              <span className="font-semibold mr-2">{post.owner_username}</span>
              {post.text}
            </p>
          </div>

          {/* Timestamp */}
          <p className="text-xs text-gray-400 uppercase mb-2">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-3 border-t border-gray-200 pt-3">
              <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 text-sm border-none focus:ring-0 p-0 focus:outline-none"
                />
                <button 
                  type="submit"
                  disabled={!commentText.trim()}
                  className={`text-sm font-semibold ${!commentText.trim() ? 'text-blue-300' : 'text-blue-500'}`}
                >
                  Post
                </button>
              </form>

              <div 
                ref={commentsRef}
                className="max-h-48 overflow-y-auto space-y-3 mt-2"
              >
                {loadingComments ? (
                  <div className="flex justify-center py-2">
                    <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : comments.length > 0 ? (
                  comments.map(comment => {
                    const isCommentOwner = user?.id === comment.owner || user?.username === comment.owner_username;
                    
                    return (
                      <div key={comment.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-semibold mr-2">{comment.owner_username}</span>
                            {comment.text}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        {isCommentOwner && (
                          <div className="flex gap-2 ml-2">
                            <button
                              onClick={() => {
                                const newText = prompt('Edit comment:', comment.text);
                                if (newText && newText !== comment.text) {
                                  handleEditComment(comment.id, newText);
                                }
                              }}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-xs text-gray-500 hover:text-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-sm text-gray-500 py-2">No comments yet</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Add comment input (always visible) */}
        {!showComments && (
          <div className="border-t border-gray-200 p-3">
            <form onSubmit={handleCommentSubmit} className="flex items-center">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 text-sm border-none focus:ring-0 focus:outline-none"
              />
              <button 
                type="submit"
                disabled={!commentText.trim()}
                className={`text-sm font-semibold ${!commentText.trim() ? 'text-blue-300' : 'text-blue-500'}`}
              >
                Post
              </button>
            </form>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-300 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">CampusConnect</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchPosts}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            title="Refresh"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition"
          >
            {showCreate ? 'Cancel' : 'Create'}
          </button>
        </div>
      </div>

      {/* Create Post Form */}
      {showCreate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="sticky z-10 bg-white border-b border-gray-200 shadow-sm"
        >
          <div className="p-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 rounded border border-gray-300 text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  className="hidden"
                  id="media-upload"
                />
                <label
                  htmlFor="media-upload"
                  className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer text-gray-600"
                  title="Add media"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </label>
                {mediaPreview && (
                  <div className="ml-3 relative">
                    {media.type.startsWith('image/') ? (
                      <img src={mediaPreview} alt="Preview" className="h-10 w-10 object-cover rounded" />
                    ) : (
                      <video src={mediaPreview} className="h-10 w-10 object-cover rounded" />
                    )}
                    <button
                      onClick={removeMedia}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleCreate}
                disabled={loading || (!text.trim() && !media)}
                className={`px-4 py-2 rounded font-medium ${(!text.trim() && !media) || loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white transition`}
              >
                {loading ? 'Posting...' : 'Share'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Posts Container */}
      <div 
        className="flex-1 overflow-y-auto p-4"
        ref={feedRef}
      >
        {posts.length === 0 && !loading ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-center mb-4">No posts yet. Be the first to share something!</p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
            >
              Create a post
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
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
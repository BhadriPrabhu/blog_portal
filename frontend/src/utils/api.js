// src/utils/api.js
import axios from 'axios';
import API_BASE_URL from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const unarchivePost = (id) => api.post('/blog/unarchive', { ids: [id] });
export const permanentDeletePost = (id) => api.post('/blog/permanent-delete', { ids: [id] });
export const addComment = (blogId, userId, value) => api.post(`/blog/${blogId}/comment`, { userId, value });
export const addReply = (blogId, commentId, userId, value) => api.post(`/blog/${blogId}/comment/${commentId}/reply`, { userId, value });
export const likeBlog = (blogId, userId) => api.put('/blog/like', { blogId, userId });
export const saveBlog = (blogId, userId) => api.post('/blog/save', { blogId, userId });
export const restorePost = (id) => api.post('/blog/restore', { ids: [id] });
export const addBlog = (postData) => api.post('/blog/add', postData);
export const replyToComment = (commentId, blogId, replyText, userId) => api.post('/blog/comments/reply', { commentId, blogId, replyText, userId });
export const fetchBlogByStatus = (status) => api.get(`/blog?status=${status}`);
export const bulkAction = (action, ids) => api.post(`/blog/${action}`, { ids });
export const fetchLikedBlogs = (userId) => api.get(`/blog/liked?userId=${encodeURIComponent(userId)}`);
export const login = (credentials) => api.post(`/`, credentials);
export const fetchMyPosts = (userId) => api.post(`/blog/mypost`, { userId });
export const register = (data) => api.post(`/register`, data);
export const fetchSavedBlogs = (userId) => api.get(`/blog/saved?userId=${encodeURIComponent(userId)}`);

export default api;
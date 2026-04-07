import axios from 'axios';
import API_BASE_URL from '../config';

// 1. Create the instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

// 2. Add Request Interceptor (The "Toll Booth")
// This automatically injects the JWT into the headers of EVERY request made via 'api'
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Add Response Interceptor (Optional but helpful)
// Handles global errors like "Token Expired" (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Session expired. Logging out...");
      // Optional: localStorage.removeItem("token");
      // window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

/** --- AUTH ENDPOINTS --- **/
export const login = (credentials) => api.post(`/`, credentials);
export const register = (data) => api.post(`/register`, data);

/** --- PROFILE ENDPOINTS --- **/
// Now this uses the shared instance! No manual token logic needed here.
export const getProfileData = (username) => api.get(`/blog/profile/${username}`);
export const editProfileData = (profileData) => api.put(`/blog/profile/edit`, profileData);
export const toggleFollow = (targetUserId) => api.post(`/blog/profile/follow/${targetUserId}`);

/** --- BLOG ENDPOINTS --- **/
export const addBlog = (postData) => api.post('/blog/add', postData);
export const getBlog = (id, userId) => api.get(`/blog/${id}`, { params: { userId } });
export const fetchMyPosts = (userId) => api.post(`/blog/mypost`, { userId });
export const likeBlog = (blogId, userId) => api.put('/blog/like', { blogId, userId });
export const saveBlog = (blogId, userId) => api.post('/blog/save', { blogId, userId });
export const fetchLikedBlogs = (userId) => api.get(`/blog/liked`, { params: { userId } });
export const fetchSavedBlogs = (userId) => api.get(`/blog/saved`, { params: { userId } });

export const unarchivePost = (id) => api.post('/blog/unarchive', { ids: [id] });
export const permanentDeletePost = (id) => api.post('/blog/permanent-delete', { ids: [id] });
export const restorePost = (id) => api.post('/blog/restore', { ids: [id] });
export const bulkAction = (action, ids) => api.post(`/blog/${action}`, { ids });

export const addComment = (blogId, userId, value, mention) => api.post(`/blog/${blogId}/comment`, { userId, value, mention });
export const addReply = (blogId, commentId, userId, value) => api.post(`/blog/${blogId}/comment/${commentId}/reply`, { userId, value });
export const replyToComment = (commentId, blogId, replyText, userId) => api.post('/blog/comments/reply', { commentId, blogId, replyText, userId });

export const fetchBlogByStatus = (status) => api.get(`/blog`, { params: { status } });
export const reportAiFlag = (id) => api.post('/blog/report', { ids: [id] });
export const unReportAiFlag = (id) => api.post('/blog/unreport', { ids: [id] });
export const fetchSuggestions = (query) => api.get(`/blog/mentions`, { params: { search: query } });

/** --- NOTIFICATION ENDPOINTS --- **/
export const notifyBlog = (data) => api.post(`/blog/notify`, data);
export const getNotify = (userId) => api.get(`/blog/getnotify/${userId}`);
export const deleteNotify = (id) => api.post("/blog/deletenotify", { id });

export const incrementViewCount = (id) => api.post(`/blog/view/${id}`);
export const incrementShareCount = (id) => api.post(`/blog/share/${id}`);

export const respondToCollabRequest = (blogId, status) => api.post('/blog/collab/respond', { blogId, status });
export const getCollaboratedBlogs = (userId) => api.get(`/blog/collab/${userId}`);

export default api;
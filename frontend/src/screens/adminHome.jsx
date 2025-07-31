import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Trash2, TrendingUp, Users, Activity } from 'lucide-react';
import { debounce } from 'lodash';
import Button from '../components/button';
import PopupAnalytics from '../components/popupAnalytics';
import DeletedPosts from '../components/deletedPosts';
import ArcheivedPosts from '../components/archeivedPosts';
import { useNavigate } from 'react-router-dom';
import { fetchBlogByStatus, bulkAction } from '../utils/api';

const StatsCard = ({ title, value, icon: Icon, color, bgColor }) => (
  <div style={{
    backgroundColor: bgColor,
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #D5DBDB',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: '200px',
    transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
  }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
  >
    <div style={{
      backgroundColor: color,
      padding: '10px',
      borderRadius: '50%',
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Icon size={20} />
    </div>
    <div>
      <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#2C3E50', fontFamily: "'Poppins', sans-serif" }}>{value}</h3>
      <p style={{ margin: 0, fontSize: '14px', color: '#2C3E50', fontWeight: '500', fontFamily: "'Poppins', sans-serif" }}>{title}</p>
    </div>
  </div>
);

export default function AdminHome() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [deletedPosts, setDeletedPosts] = useState([]);
  const [archivedPosts, setArchivedPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const postsPerPage = 10;

  const fetchData = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);

      const [activeRes, deletedRes, archivedRes] = await Promise.all([
        fetchBlogByStatus('active').catch(err => ({ error: err, data: [] })),
        fetchBlogByStatus('deleted').catch(err => ({ error: err, data: [] })),
        fetchBlogByStatus('archived').catch(err => ({ error: err, data: [] })),
      ]);

      const errors = [];
      if (activeRes.error) {
        console.error('Active posts error:', activeRes.error.response?.data || activeRes.error.message);
        errors.push(`Active posts: ${activeRes.error.response?.data?.details || activeRes.error.message}`);
      } else {
        console.log('Active posts:', activeRes.data);
      }
      if (deletedRes.error) {
        console.error('Deleted posts error:', deletedRes.error.response?.data || deletedRes.error.message);
        errors.push(`Deleted posts: ${deletedRes.error.response?.data?.details || deletedRes.error.message}`);
      } else {
        console.log('Deleted posts:', deletedRes.data);
      }
      if (archivedRes.error) {
        console.error('Archived posts error:', archivedRes.error.response?.data || archivedRes.error.message);
        errors.push(`Archived posts: ${archivedRes.error.response?.data?.details || archivedRes.error.message}`);
      } else {
        console.log('Archived posts:', archivedRes.data);
      }

      if (errors.length > 0) {
        console.warn('Status queries failed, fetching all posts:', errors);
        const allRes = await api.get('/blog');
        console.log('All posts:', allRes.data);
        const mapPosts = (data) => data.map(post => ({
          _id: post._id || '',
          title: post.title || 'Untitled',
          user: { user: post.user?.user || post.email || 'Unknown Author', email: post.email || 'unknown@example.com', role: post.user?.role || 'user' },
          desc: post.desc || '',
          date: post.date || new Date().toISOString(),
          like: post.like || 0,
          comments: (post.comments || []).map(comment => ({
            ...comment,
            status: comment.status || 'pending',
            user: comment.user || { user: 'Unknown', email: 'unknown@example.com' },
            reply: (comment.reply || []).map(reply => ({
              ...reply,
              user: reply.user || { user: 'Unknown', email: 'unknown@example.com' },
            })),
          })),
          status: post.status || 'active',
        }));
        const allPosts = mapPosts(allRes.data);
        setPosts(allPosts.filter(post => post.status === 'active'));
        setDeletedPosts(allPosts.filter(post => post.status === 'deleted'));
        setArchivedPosts(allPosts.filter(post => post.status === 'archived'));
        setError(`Failed to load some post categories: ${errors.join('; ')}. Showing all available posts.`);
        return;
      }

      const mapPosts = (data) => data.map(post => ({
        _id: post._id || '',
        title: post.title || 'Untitled',
        user: { user: post.user?.user || post.email || 'Unknown Author', email: post.email || 'unknown@example.com', role: post.user?.role || 'user' },
        desc: post.desc || '',
        date: post.date || new Date().toISOString(),
        like: post.like || 0,
        comments: (post.comments || []).map(comment => ({
          ...comment,
          status: comment.status || 'pending',
          user: comment.user || { user: 'Unknown', email: 'unknown@example.com' },
          reply: (comment.reply || []).map(reply => ({
            ...reply,
            user: reply.user || { user: 'Unknown', email: 'unknown@example.com' },
          })),
        })),
        status: post.status || 'active',
      }));

      setPosts(mapPosts(activeRes.data));
      setDeletedPosts(mapPosts(deletedRes.data));
      setArchivedPosts(mapPosts(archivedRes.data));
    } catch (err) {
      console.error('Fetch error:', err.response?.data || err.message);
      const message = err.response?.data?.details || err.response?.data?.error || 'Failed to fetch posts. Please try again later.';
      if (retryCount < 2) {
        console.log(`Retrying fetch... Attempt ${retryCount + 1}`);
        setTimeout(() => fetchData(retryCount + 1), 1000);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCommentUpdate = (postId, updatedComments) => {
    setPosts(prev => prev.map(post =>
      post._id === postId ? { ...post, comments: updatedComments } : post
    ));
  };

  const handleError = (message) => {
    setError(message);
  };

  const handleRetry = () => {
    fetchData();
  };

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
    setPage(1);
  }, 300);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleBulkAction = async (action) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (!window.confirm(`Are you sure you want to ${action} ${ids.length} post(s)?`)) return;
    try {
      await bulkAction(action, ids);
      setSelectedIds(new Set());
      await fetchData();
    } catch (err) {
      setError(`Failed to ${action} posts: ${err.response?.data?.error || err.message}`);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      let valueA, valueB;
      switch (sortField) {
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case 'date':
          valueA = new Date(a.date);
          valueB = new Date(b.date);
          break;
        case 'likes':
          valueA = a.like;
          valueB = b.like;
          break;
        case 'comments':
          valueA = a.comments.length;
          valueB = b.comments.length;
          break;
        default:
          return 0;
      }
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }, [filteredPosts, sortField, sortOrder]);

  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * postsPerPage;
    return sortedPosts.slice(start, start + postsPerPage);
  }, [sortedPosts, page]);

  const totalLikes = posts.reduce((sum, post) => sum + (post.like || 0), 0);
  const totalComments = posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: 'aliceblue',
      minHeight: '100vh',
      padding: '20px',
    }}>
      <h1 style={{ textAlign: 'center', color: '#2C3E50', fontSize: '28px', fontWeight: '600', marginBottom: '20px' }}>
        Admin Dashboard
      </h1>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <Button
          value="Go to Blog Page"
          onClick={() => navigate("/blog")}
          style={{
            backgroundColor: '#3498DB',
            color: '#FFFFFF',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease-in-out',
          }}
          hoverStyle={{ backgroundColor: '#3498DBCC' }}
        />
      </div>

      {error && (
        <div style={{ textAlign: 'center', color: '#FF6B6B', marginBottom: '20px', fontSize: '14px' }}>
          <p>{error}</p>
          <button
            onClick={handleRetry}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3498DB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '14px',
              transition: 'background-color 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#3498DBCC'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3498DB'}
          >
            Retry
          </button>
        </div>
      )}

      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Search posts by title, author, or description..."
          onChange={(e) => debouncedSearch(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #D5DBDB',
            width: '100%',
            maxWidth: '400px',
            outline: 'none',
            fontSize: '14px',
            fontFamily: "'Poppins', sans-serif",
            backgroundColor: '#F7F9FA',
            color: '#2C3E50',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
          aria-label="Search posts"
        />
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
        <StatsCard title="Total Posts" value={posts.length} icon={Activity} color="#3498DB" bgColor="#FFFFFF" />
        <StatsCard title="Total Likes" value={totalLikes} icon={TrendingUp} color="#3498DB" bgColor="#FFFFFF" />
        <StatsCard title="Total Comments" value={totalComments} icon={Users} color="#3498DB" bgColor="#FFFFFF" />
        <StatsCard title="Deleted Posts" value={deletedPosts.length} icon={Trash2} color="#FF6B6B" bgColor="#FFFFFF" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <Button
          value="Delete Selected"
          onClick={() => handleBulkAction('delete')}
          style={{
            backgroundColor: '#FF6B6B',
            color: '#FFFFFF',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease-in-out',
          }}
          hoverStyle={{ backgroundColor: '#FF6B6BCC' }}
        />
        <Button
          value="Archive Selected"
          onClick={() => handleBulkAction('archive')}
          style={{
            backgroundColor: '#3498DB',
            color: '#FFFFFF',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease-in-out',
          }}
          hoverStyle={{ backgroundColor: '#3498DBCC' }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#2C3E50' }}>
          <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V2M12 22V20M4 12H2M22 12H20M6.34 6.34L4.93 4.93M19.07 19.07L17.66 17.66M6.34 17.66L4.93 19.07M19.07 4.93L17.66 6.34" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px' }}>Loading posts...</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D5DBDB',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '20px',
          }} role="grid" aria-label="Blog posts">
            <thead>
              <tr style={{ backgroundColor: '#EDEFF2', color: '#2C3E50' }}>
                <th style={{ padding: '12px', fontWeight: '500', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    aria-label="Select all posts"
                    onChange={(e) =>
                      setSelectedIds(e.target.checked ? new Set(posts.map(p => p._id)) : new Set())
                    }
                  />
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', fontSize: '14px' }}>Profile</th>
                <th style={{ padding: '12px', textAlign: 'left', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }} onClick={() => handleSort('date')}>
                  Date {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', fontSize: '14px' }}>Author</th>
                <th style={{ padding: '12px', textAlign: 'left', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }} onClick={() => handleSort('title')}>
                  Title {sortField === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', fontSize: '14px' }}>Content</th>
                <th style={{ padding: '12px', textAlign: 'left', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }} onClick={() => handleSort('likes')}>
                  Likes {sortField === 'likes' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ padding: '12px', textAlign: 'left', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }} onClick={() => handleSort('comments')}>
                  Comments {sortField === 'comments' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedPosts.map(post => (
                <tr
                  key={post._id}
                  style={{ borderBottom: '1px solid #D5DBDB', cursor: 'pointer' }}
                  onClick={() => setSelectedPost(post)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7F9FA'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  role="row"
                >
                  <td style={{ padding: '10px' }}>
                    <input
                      type="checkbox"
                      aria-label={`Select post ${post.title}`}
                      checked={selectedIds.has(post._id)}
                      onChange={(e) => {
                        const newSet = new Set(selectedIds);
                        e.target.checked ? newSet.add(post._id) : newSet.delete(post._id);
                        setSelectedIds(newSet);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td style={{ padding: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#3498DB',
                      color: '#FFFFFF',
                      fontWeight: '600',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      {post.user?.user?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </td>
                  <td style={{ padding: '10px', fontSize: '14px', color: '#2C3E50' }}>{new Date(post.date).toLocaleDateString()}</td>
                  <td style={{ padding: '10px', fontSize: '14px', color: '#2C3E50' }}>{post.user?.user || 'Unknown'}</td>
                  <td style={{ padding: '10px', fontSize: '14px', color: '#2C3E50' }}>{post.title}</td>
                  <td style={{ padding: '10px', fontSize: '14px', color: '#2C3E50' }}>{post.desc.substring(0, 60)}...</td>
                  <td style={{ padding: '10px', fontSize: '14px', color: '#2C3E50' }}>{post.like}</td>
                  <td style={{ padding: '10px', fontSize: '14px', color: '#2C3E50' }}>{post.comments.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              style={{
                padding: '8px 16px',
                backgroundColor: page === 1 ? '#EDEFF2' : '#3498DB',
                color: page === 1 ? '#2C3E50' : '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '14px',
                transition: 'background-color 0.2s ease-in-out',
              }}
              onMouseEnter={(e) => !page === 1 && (e.target.style.backgroundColor = '#3498DBCC')}
              onMouseLeave={(e) => !page === 1 && (e.target.style.backgroundColor = '#3498DB')}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: page === i + 1 ? '#3498DB' : '#EDEFF2',
                  color: page === i + 1 ? '#FFFFFF' : '#2C3E50',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '14px',
                  transition: 'background-color 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => page !== i + 1 && (e.target.style.backgroundColor = '#3498DB33')}
                onMouseLeave={(e) => page !== i + 1 && (e.target.style.backgroundColor = '#EDEFF2')}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              style={{
                padding: '8px 16px',
                backgroundColor: page === totalPages ? '#EDEFF2' : '#3498DB',
                color: page === totalPages ? '#2C3E50' : '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '14px',
                transition: 'background-color 0.2s ease-in-out',
              }}
              onMouseEnter={(e) => !page === totalPages && (e.target.style.backgroundColor = '#3498DBCC')}
              onMouseLeave={(e) => !page === totalPages && (e.target.style.backgroundColor = '#3498DB')}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <DeletedPosts
        posts={deletedPosts}
        onRestore={(post) => {
          setPosts(prev => [...prev, { ...post, status: 'active' }]);
          setDeletedPosts(prev => prev.filter(p => p._id !== post._id));
        }}
        onError={handleError}
      />

      <ArcheivedPosts
        posts={archivedPosts}
        onUnarchive={(post) => {
          setPosts(prev => [...prev, { ...post, status: 'active' }]);
          setArchivedPosts(prev => prev.filter(p => p._id !== post._id));
        }}
        onError={handleError}
      />

      {selectedPost && <PopupAnalytics post={selectedPost} onClose={() => setSelectedPost(null)} onCommentUpdate={handleCommentUpdate} />}

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="padding: 20px"] {
            padding: 12px;
          }
          h1 {
            font-size: 24px !important;
          }
          input {
            padding: 8px 12px !important;
            font-size: 12px !important;
          }
          div[style*="minWidth: 200px"] {
            min-width: 160px !important;
            padding: 12px !important;
          }
          div[style*="minWidth: 200px"] h3 {
            font-size: 18px !important;
          }
          div[style*="minWidth: 200px"] p {
            font-size: 12px !important;
          }
          table {
            font-size: 12px !important;
          }
          th, td {
            padding: 8px !important;
          }
          button {
            padding: 6px 12px !important;
            font-size: 12px !important;
          }
          div[style*="width: 32px"] {
            width: 24px !important;
            height: 24px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
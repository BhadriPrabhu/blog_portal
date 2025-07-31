import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Archive, Tag, Shield, BarChart3, Users, TrendingUp, Activity } from 'lucide-react';
import Button from './Button';
import Pop_Up_Analytics from './Pop_Up_Analytics';
import Deleted_Posts from './Deleted_Posts';
import Archeived_Posts from './Archeived_Posts';

const StatsCard = ({ title, value, icon: Icon, color, bgColor }) => {
  return (
    <div style={{
      backgroundColor: bgColor,
      padding: '24px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      minWidth: '200px'
    }}>
      <div style={{
        backgroundColor: color,
        padding: '12px',
        borderRadius: '12px',
        color: '#fff0f0'
      }}>
        <Icon size={24} />
      </div>
      <div>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '700', color: '#4a2c2c' }}>{value}</h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#4a2c2c', fontWeight: '500' }}>{title}</p>
      </div>
    </div>
  );
};

const Admin_Home = () => {
  const [posts, setPosts] = useState([
    { id: 1, date: 'July 22, 2025', author: 'DataScientist_Pro', title: 'Advanced ML Techniques for Time Series', content: 'Exploring cutting-edge machine learning approaches for time series forecasting...', likes: 245, comments: 67 },
    { id: 2, date: 'July 21, 2025', author: 'AI_Researcher', title: 'Deep Learning for Computer Vision', content: 'Comprehensive guide to implementing state-of-the-art computer vision models...', likes: 189, comments: 43 },
    { id: 3, date: 'July 20, 2025', author: 'KaggleGrandmaster', title: 'Feature Engineering Masterclass', content: 'Learn advanced feature engineering techniques...', likes: 312, comments: 91 },
    { id: 4, date: 'July 19, 2025', author: 'DataViz_Expert', title: 'Interactive Data Visualization with D3.js', content: 'Creating stunning interactive visualizations...', likes: 156, comments: 29 },
    { id: 5, date: 'July 18, 2025', author: 'MLOps_Engineer', title: 'Scaling ML Models in Production', content: 'Best practices for deploying and scaling machine learning models...', likes: 278, comments: 52 },
    { id: 6, date: 'July 17, 2025', author: 'NLP_Specialist', title: 'Transformer Architecture Deep Dive', content: 'Understanding the mathematics and implementation details...', likes: 201, comments: 38 }
  ]);
  const [deletedPosts, setDeletedPosts] = useState([]);
  const [archivedPosts, setArchivedPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Handle restoring a post
  const handleRestore = useCallback((post) => {
    setPosts(prev => [...prev, post]);
    setDeletedPosts(prev => prev.filter(p => p.id !== post.id));
  }, []);

  // Handle unarchiving a post
  const handleUnarchive = useCallback((post) => {
    setPosts(prev => [...prev, post]);
    setArchivedPosts(prev => prev.filter(p => p.id !== post.id));
  }, []);

  // Handle deleting a post
  const handleDelete = useCallback((id) => {
    const postToDelete = posts.find(post => post.id === id);
    if (postToDelete) {
      setDeletedPosts(prev => [...prev, postToDelete]);
      setPosts(prev => prev.filter(post => post.id !== id));
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  }, [posts]);

  // Handle bulk delete
  const handleBulkAction = (action) => {
    selectedIds.forEach(id => {
      const post = posts.find(p => p.id === id);
      if (action === 'delete' && post) {
        setDeletedPosts(prev => [...prev, post]);
        setPosts(prev => prev.filter(p => p.id !== id));
      } else if (action === 'archive' && post) {
        setArchivedPosts(prev => [...prev, post]);
        setPosts(prev => prev.filter(p => p.id !== id));
      }
    });
    setSelectedIds(new Set());
  };

  // Handle Delete key press
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Delete' && selectedIds.size > 0) {
        handleBulkAction('delete');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedIds, handleBulkAction]);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);

  const handleRouteToDetails = (id) => {
    console.log(`Routing to /post/${id}`);
  };

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(135deg, #f5e9e9 0%, #ffebee 100%)',
      minHeight: '100vh',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: '#f5e9e9',
        padding: '32px',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, #f5e9e9 0%, #ffebee 100%)'
      }}>
        <h1 style={{
          margin: '0 0 16px 0',
          fontSize: '32px',
          fontWeight: '800',
          color: '#4a2c2c',
          textAlign: 'center'
        }}>
          🚀 Admin Dashboard
        </h1>
        <p style={{
          margin: '0 0 24px 0',
          fontSize: '16px',
          color: '#4a2c2c',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          Manage posts, monitor engagement, and keep your community thriving
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="🔍 Search posts, authors, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '12px 20px',
              fontSize: '14px',
              border: '2px solid #f5e9e9',
              borderRadius: '12px',
              width: '400px',
              maxWidth: '100%',
              outline: 'none',
              transition: 'all 0.3s ease',
              fontFamily: "'Poppins', sans-serif",
              backgroundColor: '#fff0f0',
              color: '#4a2c2c'
            }}
            onFocus={(e) => e.target.style.borderColor = '#e0c7c7'}
            onBlur={(e) => e.target.style.borderColor = '#f5e9e9'}
          />
        </div>

        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <StatsCard title="Total Posts" value={posts.length} icon={Activity} color="#e0c7c7" bgColor="#f5e9e9" />
          <StatsCard title="Total Likes" value={totalLikes} icon={TrendingUp} color="#e0c7c7" bgColor="#f5e9e9" />
          <StatsCard title="Total Comments" value={totalComments} icon={Users} color="#e0c7c7" bgColor="#f5e9e9" />
          <StatsCard title="Deleted Posts" value={deletedPosts.length} icon={Trash2} color="#e0c7c7" bgColor="#f5e9e9" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button value="Delete Selected" onClick={() => handleBulkAction('delete')} />
        <Button value="Archive Selected" onClick={() => handleBulkAction('archive')} />
        <Button value="Mark as Spam" onClick={() => handleBulkAction('spam')} />
      </div>

      <div style={{
        backgroundColor: '#f5e9e9',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        width: '100%',
        maxWidth: '1200px'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#e0c7c7', color: '#4a2c2c' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}><input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? new Set(posts.map(p => p.id)) : new Set())} /></th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Profile</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Author</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Title</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Content</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Likes</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Comments</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map(post => (
              <tr key={post.id} style={{ backgroundColor: '#fff0f0', borderBottom: '1px solid #f5e9e9' }}>
                <td style={{ padding: '12px' }} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(post.id)}
                    onChange={(e) => {
                      const newSet = new Set(selectedIds);
                      if (e.target.checked) newSet.add(post.id);
                      else newSet.delete(post.id);
                      setSelectedIds(newSet);
                    }}
                  />
                </td>
                <td style={{ padding: '12px' }} onClick={(e) => { e.stopPropagation(); handleRouteToDetails(post.id); }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#e0c7c7',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4a2c2c',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    {post.author.charAt(0)}
                  </div>
                </td>
                <td style={{ padding: '12px', color: '#4a2c2c' }} onClick={() => setSelectedPost(generateMockAnalytics(post))}>{post.date}</td>
                <td style={{ padding: '12px', color: '#4a2c2c' }} onClick={() => setSelectedPost(generateMockAnalytics(post))}>{post.author}</td>
                <td style={{ padding: '12px', color: '#4a2c2c' }} onClick={() => setSelectedPost(generateMockAnalytics(post))}>{post.title}</td>
                <td style={{ padding: '12px', color: '#4a2c2c' }} onClick={() => setSelectedPost(generateMockAnalytics(post))}>{post.content.substring(0, 50)}...</td>
                <td style={{ padding: '12px', color: '#4a2c2c' }} onClick={() => setSelectedPost(generateMockAnalytics(post))}>{post.likes}</td>
                <td style={{ padding: '12px', color: '#4a2c2c' }} onClick={() => setSelectedPost(generateMockAnalytics(post))}>{post.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Deleted_Posts posts={deletedPosts} onRestore={handleRestore} />
      <Archeived_Posts posts={archivedPosts} onUnarchive={handleUnarchive} />

      {selectedPost && <Pop_Up_Analytics post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </div>
  );
};

export default Admin_Home;
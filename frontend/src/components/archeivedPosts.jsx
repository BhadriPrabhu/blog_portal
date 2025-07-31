import React, { useState } from 'react';
import axios from 'axios';
import { Archive, XCircle } from 'lucide-react';
import PopupPostDetails from './popupPostDetails';

export default function ArchivedPosts({ posts, onUnarchive, onError }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePopupToggle = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleUnarchivePost = async (id) => {
    if (!window.confirm('Are you sure you want to unarchive this post?')) return;
    setIsLoading(true);
    try {
      await axios.post('http://localhost:3000/blog/unarchive', { ids: [id] });
      const postToUnarchive = posts.find(post => post._id === id);
      if (postToUnarchive && onUnarchive) {
        onUnarchive(postToUnarchive);
      }
      setSelectedPost(null);
      setIsPopupOpen(false);
    } catch (err) {
      onError('Failed to unarchive post. Please try again.');
      console.error('Unarchive error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this post?')) return;
    setIsLoading(true);
    try {
      await axios.post('http://localhost:3000/blog/permanent-delete', { ids: [id] });
      setSelectedPost(null);
      setIsPopupOpen(false);
    } catch (err) {
      onError('Failed to permanently delete post. Please try again.');
      console.error('Permanent delete error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#F7F9FA',
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #D5DBDB',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      marginBottom: '16px',
      fontFamily: "'Poppins', sans-serif",
      transition: 'transform 0.2s ease-in-out',
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    onClick={handlePopupToggle}
    >
      <h2 style={{
        margin: '0 0 12px 0',
        fontSize: '20px',
        fontWeight: '600',
        color: '#2C3E50',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <Archive size={18} color="#3498DB" />
        Archived Posts
      </h2>
      {posts.length === 0 ? (
        <p style={{ color: '#2C3E50', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>
          No archived posts available.
        </p>
      ) : null}

      {isPopupOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)',
          padding: '12px',
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #D5DBDB',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            width: '100%',
            maxWidth: '960px',
            maxHeight: '85vh',
            overflowY: 'auto',
            position: 'relative',
          }}>
            <div style={{
              backgroundColor: '#EDEFF2',
              padding: '12px 16px',
              borderRadius: '12px 12px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#2C3E50' }}>
                Archived Posts
              </h3>
              <button
                onClick={handlePopupToggle}
                disabled={isLoading}
                style={{
                  backgroundColor: '#3498DB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  fontFamily: "'Poppins', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background-color 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#3498DBCC')}
                onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#3498DB')}
              >
                <XCircle size={16} />
                Close
              </button>
            </div>
            <div style={{ padding: '12px' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: '0 8px',
                fontSize: '14px',
                fontFamily: "'Poppins', sans-serif",
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#EDEFF2', color: '#2C3E50' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '500', width: '5%' }}>Profile</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '500', width: '15%' }}>Date</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '500', width: '15%' }}>Author</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '500', width: '20%' }}>Title</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '500', width: '30%' }}>Content</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '500', width: '10%' }}>Likes</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '500', width: '10%' }}>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr
                      key={post._id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        cursor: 'pointer',
                        borderBottom: '1px solid #D5DBDB',
                        transition: 'background-color 0.2s ease-in-out',
                      }}
                      onClick={() => setSelectedPost(post)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7F9FA'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: '#3498DB',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontWeight: '600',
                          fontSize: '14px',
                        }}>
                          {post.user?.user?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#2C3E50' }}>
                        {new Date(post.date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#2C3E50' }}>{post.user?.user || 'Unknown'}</td>
                      <td style={{ padding: '12px 16px', color: '#2C3E50' }}>{post.title}</td>
                      <td style={{ padding: '12px 16px', color: '#2C3E50' }}>
                        {post.desc.substring(0, 50)}...
                      </td>
                      <td style={{ padding: '12px 16px', color: '#2C3E50' }}>{post.like}</td>
                      <td style={{ padding: '12px 16px', color: '#2C3E50' }}>{post.comments.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {isLoading && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 20,
              }}>
                <svg
                  className="animate-spin"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4V2M12 22V20M4 12H2M22 12H20M6.34 6.34L4.93 4.93M19.07 19.07L17.66 17.66M6.34 17.66L4.93 19.07M19.07 4.93L17.66 6.34"
                    stroke="#2C3E50"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      )}
      {selectedPost && (
        <PopupPostDetails
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onRestore={handleUnarchivePost}
          onDelete={handlePermanentDelete}
          isDeleted={false}
        />
      )}
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="padding: 16px"] {
            padding: 12px;
          }
          div[style*="maxWidth: 960px"] {
            max-width: 100%;
            margin: 0 8px;
          }
          h2 {
            font-size: 18px !important;
          }
          h3 {
            font-size: 14px !important;
          }
          table {
            font-size: 12px !important;
          }
          th, td {
            padding: 8px !important;
          }
          div[style*="width: 32px"] {
            width: 24px !important;
            height: 24px !important;
            font-size: 12px !important;
          }
          button {
            padding: 6px 12px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}